# As-built CodeGraph candidate

This is descriptive source evidence, not a replacement or approved architecture.
The parent .puml is a file-level graph; edge labels aggregate actual cross-file
edge kinds/counts. Each file has a standalone symbol-level .puml showing every
indexed node and intra-file edge. index.json maps files to their diagrams and
exact cross-file edges. graph.json preserves all 2,715 nodes and 6,853 edges,
including source lines, IDs, metadata and provenance. There are no invented
HTTP, SDK, dynamic callback or TS-to-Rust links. CodeGraph is not a full compiler
AST; neither rendered diagrams nor missing static edges establish runtime behavior.
The original architecture is preserved unchanged in ../evidence-20261028-045031/.
