"""Bound a tool invocation without restarting shared services or distributions."""
import argparse
import subprocess
import sys

parser = argparse.ArgumentParser()
parser.add_argument('--timeout', type=float, required=True)
parser.add_argument('command', nargs=argparse.REMAINDER)
args = parser.parse_args()
command = args.command[1:] if args.command[:1] == ['--'] else args.command
try:
    result = subprocess.run(command, timeout=args.timeout)
    sys.exit(result.returncode)
except subprocess.TimeoutExpired:
    print(f'Timed out after {args.timeout:g}s: {command[0]} (only this client was stopped)', file=sys.stderr)
    sys.exit(124)
