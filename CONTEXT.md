# barangIF

barangIF is a public showcase board where Informatika (IF) students and builders "pamer" (show off) interesting things — websites/products and AI prompts — each ranked by community votes. No accounts required.

## Language

**Barang**:
An item a user submits to be showcased. It is either a Situs or a Prompt.
_Avoid_: entry, post, item

**Situs**:
A Barang of kind `site` — a website, product, or social account link that someone is showing off.
_Avoid_: site, link, project

**Prompt**:
A Barang of kind `prompt` — a reusable AI instruction / playbook someone is showing off.
_Avoid_: snippet, entry

**Pamer**:
The act of submitting a Barang to a board.
_Avoid_: submit, post

**Board**:
A ranked list of Barang of one kind. There are two boards: Situs and Prompt.
_Avoid_: list, feed

**Score**:
The ranking metric of a Barang: `upvotes × 3 + clicks`.
_Avoid_: rank value

**Upvote**:
A community signal that increases a Barang's Score. Deduped per visitor via `localStorage`.
_Avoid_: like, vote

**Click**:
When a visitor opens a Barang's destination link; increments the click count and thus the Score.
_Avoid_: visit

**has_chatbot**:
A flag chosen by the submitter: whether the Barang's detail page shows a floating mini-RAG chatbot that explains the Barang.
_Avoid_: bot flag

**Meta**:
Structured information the submitter provides when `has_chatbot` is true; it is the corpus the mini-RAG chatbot answers from. Required and complete when `has_chatbot` is true.
_Avoid_: details, info

**Mini-RAG**:
A retrieval-augmented chat that answers only from the Barang's `Meta` + description/body, so it does not hallucinate outside that context.
_Avoid_: chatbot, AI

**Report**:
A visitor flag that a Barang is harmful; accumulates per-IP and auto-hides the Barang past a threshold.
_Avoid_: flag, complain

**Owner token**:
A secret returned once at submit time that lets the submitter delete or edit their own Barang without an account.
_Avoid_: edit key
