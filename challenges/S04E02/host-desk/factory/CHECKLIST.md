# Checklist

- A role never pays or sends the same item twice: it checks the item's status first, and retries reuse the same key.
- Have every role read its facts (settings, prices, limits) from their source at every start; never copy them into its files. [S04E02 rule 4]
- Write down why each decision exists, next to the code, and have every role read those notes before it judges or changes anything. [S04E02 rule 5]
