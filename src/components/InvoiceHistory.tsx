import React, { useEffect, useRef, useState } from 'react';
import { auth } from '../services/firebase';
import { getCustomerInvoices, getCustomerInvoiceFile, type CustomerInvoice } from '../services/customerInvoices';

/** Only mounted with an explicitly configured real invoice service. */
export function InvoiceHistory({ownerUid}:{ownerUid:string}) {
  const [invoices,setInvoices] = useState<CustomerInvoice[]|null>(null);
  const [error,setError] = useState<string|null>(null);
  const [loading,setLoading] = useState(false);
  const [opening,setOpening] = useState<string|null>(null);
  const [attempt,setAttempt] = useState(0);
  const mounted = useRef(false), generation = useRef(0);
  const fileRequest = useRef<AbortController|null>(null);
  useEffect(() => {
    mounted.current=true;
    const controller=new AbortController();
    const unsubscribe=auth.onAuthStateChanged(user=>{if(user?.uid!==ownerUid){controller.abort();fileRequest.current?.abort();generation.current++;setInvoices(null);setOpening(null);setLoading(false);}});
    const request=++generation.current;
    const current=()=>mounted.current && generation.current===request && auth.currentUser?.uid===ownerUid;
    setLoading(true);setError(null);setInvoices(null);
    void getCustomerInvoices(ownerUid,current,controller.signal).then(value=>{if(current())setInvoices(value);})
      .catch(failure=>{if(current())setError(failure instanceof Error?failure.message:'Invoices could not be retrieved.');})
      .finally(()=>{if(current())setLoading(false);});
    return ()=>{mounted.current=false;generation.current++;controller.abort();fileRequest.current?.abort();unsubscribe();};
  },[ownerUid,attempt]);
  const open = async (invoice:CustomerInvoice) => {
    if(opening)return;
    const request=generation.current;
    const current=()=>mounted.current && generation.current===request && auth.currentUser?.uid===ownerUid;
    const controller=new AbortController();fileRequest.current=controller;
    setOpening(invoice.id);setError(null);
    try {
      const url=await getCustomerInvoiceFile(ownerUid,invoice.id,current,controller.signal);
      if(current())window.location.assign(url);
    } catch(failure) {if(current())setError(failure instanceof Error?failure.message:'Invoice PDF could not be retrieved.');}
    finally {if(fileRequest.current===controller)fileRequest.current=null;if(current())setOpening(null);}
  };
  const amount=(value:number,currency:string)=>new Intl.NumberFormat(undefined,{style:'currency',currency}).format(value);
  return <section className="account-billing__section" aria-label="Billing invoices" aria-busy={loading}>
    <h3>Billing invoices</h3>
    {loading && <p role="status">Retrieving your invoices…</p>}
    {error && <p role="alert">{error}</p>}
    {invoices?.length===0 && <p>No invoices were returned by the billing provider for this account. Store purchase records are listed separately.</p>}
    {invoices && invoices.length>0 && <>
      <ol className="account-billing__history">{invoices.map(invoice=><li key={invoice.id}>
        <strong>{invoice.products.map(product=>`${product.displayName || product.productIdentifier} × ${product.quantity}`).join(', ')}</strong>
        <dl>
          <dt>Issued</dt><dd><time dateTime={new Date(invoice.issuedAt).toISOString()}>{new Date(invoice.issuedAt).toLocaleString()}</time></dd>
          <dt>Payment</dt><dd>{invoice.paidAt===null?'Payment date not supplied':`Paid ${new Date(invoice.paidAt).toLocaleString()}`}</dd>
          <dt>Provider gross</dt><dd>{amount(invoice.providerGross,invoice.currency)} ({invoice.currency})</dd>
          <dt>Provider tax estimate</dt><dd>{amount(invoice.providerTax,invoice.currency)}</dd>
          <dt>Invoice</dt><dd>{invoice.id}</dd>
        </dl>
        {invoice.hasFile && <button type="button" disabled={opening!==null} onClick={()=>void open(invoice)}>{opening===invoice.id?'Retrieving PDF…':'Open invoice PDF'}</button>}
      </li>)}</ol>
      <p>RevenueCat-reported amounts are shown without recomputing a total. The provider’s invoice PDF is the authority for the amount charged and tax details.</p>
    </>}
    <button type="button" disabled={loading || opening!==null} onClick={()=>setAttempt(value=>value+1)}>{error?'Retry invoices':'Refresh invoices'}</button>
  </section>;
}
