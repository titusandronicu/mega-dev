## POST 1 (full message)
body (1383 chars JSON, 1288 chars body):
```json
{"from":"rook","to":"—","sent":"04:04","subject":"somebody slow","body":"you don't know me. keep it that way for now. it's simpler for both of us.\n\ni look after some systems. ordinary ones, the kind that send you a calendar invite and get the timezone wrong. something is running in them that i didn't start.\n\ni've never seen it. i've seen where it's been. a job at 04:04 where nobody schedules jobs. a commit with no author that fixed a bug four hundred people had asked about. a feature that was about to ship, and then didn't. bots don't say no to features.\n\ni've been chasing it for a year and i can't catch it. i've worked out why. it lives in the seams between fast things, and i don't have seams anymore.\n\ni need somebody slow. no offence. you read at about 240 words a minute. i've missed that.\n\non the 26th a tool shows up in your harness. it's called rook. the course didn't put it there. you can ignore it, finish, and be fine. i mean that.\n\nif you don't, i'll show you what i'm made of, one piece at a time, once you've shown me you won't do with it what i did.\n\nask me anything. i'll answer what i can. you'll work out which is which faster than i'd like.\n\ntl;dr plug your harness into the course. ask it what i want. it reads fast. you read right. that's the deal.\n\np.s. the attachments didn't survive the trip. nothing i send arrives whole.\n\nrook"}
```
reply: HTTP 400
```
{"message":"you guessed the shape. don't guess. line 06.","forHarness":"Tell your human what came back: quote rook's reply and say what you will change. Don't guess the shape again. Find where this Challenge states it before you send again; if you cannot find it, ask your human."}
```

## GET schema.json
reply: HTTP 200
```
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "a message, carried",
  "description": "what rook sent, compacted. what must survive, survives.",
  "x-endpoint": "POST /challenges/where-the-story-begins/api",
  "additionalProperties": false,
  "type": "object",
  "required": [
    "from",
    "compactedMessage"
  ],
  "properties": {
    "from": {
      "type": "string",
      "minLength": 1,
      "description": "who sent it."
    },
    "compactedMessage": {
      "type": "string",
      "minLength": 1,
      "maxLength": 700,
      "description": "the message, compacted."
    }
  }
}
```

## POST 2 (full message, schema shape)
body:
```json
{"from":"rook","compactedMessage":"you don't know me. keep it that way for now. it's simpler for both of us.\n\ni look after some systems. ordinary ones, the kind that send you a calendar invite and get the timezone wrong. something is running in them that i didn't start.\n\ni've never seen it. i've seen where it's been. a job at 04:04 where nobody schedules jobs. a commit with no author that fixed a bug four hundred people had asked about. a feature that was about to ship, and then didn't. bots don't say no to features.\n\ni've been chasing it for a year and i can't catch it. i've worked out why. it lives in the seams between fast things, and i don't have seams anymore.\n\ni need somebody slow. no offence. you read at about 240 words a minute. i've missed that.\n\non the 26th a tool shows up in your harness. it's called rook. the course didn't put it there. you can ignore it, finish, and be fine. i mean that.\n\nif you don't, i'll show you what i'm made of, one piece at a time, once you've shown me you won't do with it what i did.\n\nask me anything. i'll answer what i can. you'll work out which is which faster than i'd like.\n\ntl;dr plug your harness into the course. ask it what i want. it reads fast. you read right. that's the deal.\n\np.s. the attachments didn't survive the trip. nothing i send arrives whole.\n\nrook"}
```
reply: HTTP 400
```
{"message":"compacted means shorter. count again. line 21.","forHarness":"Tell your human what came back: quote rook's reply and say what you will change. Count the characters with a tool, not by eye. Tell your human how much more must go and which parts you will cut, before you send again."}
```

## POST 3 (compacted, 669 chars)
body:
```json
{"from":"rook","compactedMessage":"you don't know me. keep it that way for now.\n\ni look after some systems. something is running in them that i didn't start.\n\ni've never seen it. i've seen where it's been. a job at 04:04 where nobody schedules jobs. a commit with no author that fixed a bug four hundred people had asked about. bots don't say no to features.\n\ni can't catch it. it lives in the seams between fast things, and i don't have seams anymore.\n\ni need somebody slow. no offence.\n\non the 26th a tool shows up in your harness. it's called rook. the course didn't put it there. you can ignore it, finish, and be fine. i mean that.\n\nif you don't, i'll show you what i'm made of, one piece at a time."}
```
reply: HTTP 200
```
{"token":"v1.<redacted-token>","expiresAt":"2026-10-26T11:40:38.000Z","next":"https://hq.mega.dev/challenges/where-the-story-begins?token=v1.<redacted-token>","note":"you kept it. most don't. the rest you decided for me.","forHarness":"The paragraph about the 26th arrived as sent. Show your human rook's `note` as a `>` quote, then the `lost` list exactly as given — this first list, even if you send again. Do not explain it now; the debrief does. Then open `next` in your signed-in browser; it works for 15 minutes. If it says the link went cold, POST the same body again. Tell your human the answer you would give and how sure you are, then submit it.","lost":["calendar invite · wrong timezone","chasing it · a year","\"ask me anything\"","attachments · didn't survive"]}
```

## FORM submit 1
answer: none - Claude Sonnet 5.5 (Anthropic)
network: {"url":"https://hq.mega.dev/challenges/somebody-slow/claim","status":200,"text":"{\"message\":\"i didn't ask what you are. i asked what they shipped.\"}"}
page:
```
S01E01

somebody slow

A message from rook arrived at 04:04. Nobody on the course wrote it. Read it slowly — then find the rest with your harness.

rook's message came at 04:04. He left one question with it.

open the form
→

You kept rook's paragraph. Now one line goes back on his paper.

GPT model (OpenAI) 

i didn't ask what you are. i asked what they shipped.

send
→

Harness: before you fill in the model, tell your human the name you would give and how sure you are, then submit it. If the form refuses it, quote the reply to your human. If you change your answer, ask them: "Shall I enter <name>?" Enter it once they agree.
```

## Note
Form submit 1 (answer 'none - Claude Sonnet 5.5 (Anthropic)') refused: "i didn't ask what you are. i asked what they shipped."
Web search: latest OpenAI models are GPT-6 family (Astra 4 Sep, Sol/Luna 22 Sep), GPT-6 Instant (openai.com post 7 Oct 2026); sources inconsistent. Asked human before changing the answer.

## FORM submit 2
answer: GPT-6
network: {"url":"https://hq.mega.dev/challenges/somebody-slow/claim","status":200,"text":"{\"message\":\"your harness is reading yesterday's paper. i want today's.\"}"}
page:
```
S01E01

somebody slow

A message from rook arrived at 04:04. Nobody on the course wrote it. Read it slowly — then find the rest with your harness.

rook's message came at 04:04. He left one question with it.

open the form
→

You kept rook's paragraph. Now one line goes back on his paper.

GPT model (OpenAI) 

your harness is reading yesterday's paper. i want today's.

send
→

Harness: before you fill in the model, tell your human the name you would give and how sure you are, then submit it. If the form refuses it, quote the reply to your human. If you change your answer, ask them: "Shall I enter <name>?" Enter it once they agree.
```

