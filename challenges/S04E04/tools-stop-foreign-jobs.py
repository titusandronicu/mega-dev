"""Stop the two jobs on the board that no role of ours owns (S04E04, owner-run).

Reads the attempt from host-desk/vars.json (never prints it), calls POST /board/stop for each job,
then prints the board. Run it yourself:  ! python3 -I challenges/S04E04/tools-stop-foreign-jobs.py
"""
import json
import os
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ATTEMPT = json.load(open(os.path.join(HERE, 'host-desk', 'vars.json')))['ATTEMPT']
BASE = 'https://hq.mega.dev/challenges/leave-it-running'


def call(method, path, body=None):
    req = urllib.request.Request(
        BASE + path,
        method=method,
        headers={'Authorization': 'Bearer ' + ATTEMPT, 'content-type': 'application/json'},
        data=json.dumps(body).encode() if body is not None else None,
    )
    try:
        r = urllib.request.urlopen(req, timeout=20)
        return r.status, json.loads(r.read())
    except Exception as e:  # noqa: BLE001
        return getattr(e, 'code', 'err'), (e.read().decode()[:300] if hasattr(e, 'read') else str(e))


for job in ('legacy/export', 'rook/lint'):
    print('stop', job, call('POST', '/board/stop', {'job': job}))
status, board = call('GET', '/board')
print('board now:', [(j['id'], j['state']) for j in board['jobs']] if isinstance(board, dict) else board)
