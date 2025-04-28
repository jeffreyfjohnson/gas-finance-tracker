# gas-finance-tracker

## Why it's useful
- It takes care of the tedious aspects of tracking your spending, but allows complete flexibility in how you visualize and process your data
- You don't have to entrust your financial institution passwords to a third party. Everything is processed within the Google ecosystem. There is no extra risk introduced to automatically track your transactions.

## How it works
1. Your financial institution sends you an email informing you of a transaction
2. Gmail filters take this email, and apply a label to it (eg `financial-transactions`)
3. This Google Apps Script runs once every hour/day/week (your choice). It finds the emails with the assigned label after the last transaction that it processed, and then extracts all the relevant info from each email
4. (optional) The script checks your `rules` and `categories` tabs to see how the transaction should be handled/categorized
5. The script writes a row to your spreadsheet with all the relevant info

## Known limitations
- This only works with Gmail/Google accounts. Luckily these are free
- Gas purchases have to be input manually. I assume this is because at the time a email is sent by your credit card company, the total for the transaction is not known. Gas purchases simply will not show up in your spreadsheet
- Pre-authorization charges (eg a rideshare company charges you $1 for a scooter ride before finalizing the amount when you finish the ride) will not be removed. You will have to reconcile the preauth charge with the final charge, or just remove the row entirely from your spreadsheet

## Currently Supported Institutions
- Chase credit cards
- US Bank credit cards
- Bank of America credit cards
- Capital One credit cards
- Venmo
If there are other institutions you want to see supported, follow the patterns in the `parsers` directory, and submit a PR!

## Setup (Simpler)
1. This is the most tedious. You have to go into your account for all the financial instituions you care about (eg, your credit card, your bank, your peer to peer payments account), go to your account settings, and turn on email notifications. These notifications must go to your Gmail account that holds the script and spreadsheet
2. 

