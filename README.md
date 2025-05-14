# gas-finance-tracker

[![License: CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc/4.0/)

[Jump to simple setup](#simpler-setup)

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
- Similarly, when you go to a restaurant, they run your card, and then you fill out the tip later, the tip will not be accounted for. You can fix this manually

## Currently Supported Institutions
- Chase credit cards
- US Bank credit cards
- Bank of America credit cards
- Capital One credit cards
- Venmo 

If there are other institutions you want to see supported, follow the patterns in the `parsers` directory, and submit a PR!

## Simpler Setup
1. This is the most tedious. You have to go into your account for all the financial instituions you care about (eg, your credit card, your bank, your peer to peer payments account), go to your account settings, and turn on email notifications for any transactions that you care about. These notifications must go to your Gmail account that holds the script and spreadsheet
2. Go to [setup.js](https://github.com/jeffreyfjohnson/gas-finance-tracker/blob/main/setup.js) and copy the entire contents of the file (there is a convenient "Copy raw file" button in the top bar of the GitHub file UI)
3. Go to [https://script.google.com/home](https://script.google.com/home), and create a new project. If you have multiple Google accounts, make sure the selected user is the email your email notifications are being sent to.
4. Delete all the contents of the `Code.js` file, and paste **everything** from the `setup.js` file you just copied. Press save
5. Click the plus button next to "Services" in the left sidebarm and add the Gmail API  
   ![image](https://github.com/user-attachments/assets/cf076ce1-d18a-44da-9b3a-403ae1368c3e)

7. In the top bar of the Google Apps Script console, next to run and debug, select `_setup`, then press run. This script will:  
       - create gmail filters for email notifications from the supported institutions  
       - copy the template spreadsheet to your own account  
       - send you an email with a link to the spreadsheet, and further setup instructions  
8. You will see a permission dialog. Click review permissions, and then select your Google account that will be sent the email notifications (the same account under which you made this Google Apps Script project)
10. You will see a scary looking warning  
    <img width="644" alt="image" src="https://github.com/user-attachments/assets/1bf29ad7-434a-4567-a59e-a2cb5895cddd" />
11. ⚠️⚠️⚠️ If the email is not your email **stop immediately, and delete the GAS project. MAKE SURE THE EMAIL IS EXACTLY YOUR EMAIL WITH NO DEVIATIONS** 
12. If the email is your email, you have nothing to worry about. You are giving yourself access to all your data. That is fine. Click "Advanced", and then the "Continue to Untitled/whatever you named your project (unsafe)" link
13. Grant all the permissions, and then continue
14. Wait a few seconds, then check your email. You should get an email from the script with a link to your new spreadsheet, and an attachment called `combined.js`
15. Open the `combined.js` attachment, and copy the **entire contents** of the file
16. Delete the contents of the `Code.js` file of your project that you used to run the setup script. Paste the contents of `combined.js` into this same file, and click save.
17. By the same method as before, in the run menu select `getTransactionsForDay`, click run, and grant permissions. Congrats, you've done the hard part! 
18. You can now set this up to run automatically. Go to the `Triggers` page from the left pane, click `Add Trigger`, and then select `getTransactionsForDay` as the function to run. You can elect to have it run every minute (completely excessive), hour (pretty reasonable), day, etc. Save this, and your financial transactions should start rolling in automatically!

## Customizations
- Add more categories to the `overview` sheet of the spreadsheet. These will propogate a few places throughout the spreadsheet
- Speaking of categories, in the `categories` sheet, you can define default categories if the transaction description contains a certain string
  - for instance if you mapped `safeway` to the `Groceries` category, and a transaction came in with description `SAFEWAYGROCERY #4321`, that transaction will automatically be categorized as `Groceries`
- Using a similar process you used to schedule the main part of the script, you can have it email you every day/week/whatever if there are expenses missing categories, or income missing a description. Just go through the same process as above, but select the `remind` function instead of `getTransactionsForDay`
- In the `rules` sheet, you can get more advanced with your customization. For any of the first 3 columns aka the "if" columns, you can put what strings need to be present in the email, description or extra data, in order for the following modifications to apply
  - if any of the first 3 columns are empty, they are ignored for that rule
  - email is self explanatory, use one of the following:
    - `venmo`
    - `chase`
    - `usbank`
    - `bankofamerica`
    - `capitalone`
  - description just checks the transaction description
  - extra data checks data that the script provides which is not visible from the spreadsheet itself. The only place it is used right now, is for Chase credit card transactions, where extra data is the last 4 of the card number
  - Then you can choose an action (`Spending`, `Income`, `Ignored`), which will post the transaction matching the criteria to the corresponding sheet. This must always be present for a rule
  - You can also add a multiplier for the amount or shared amount
  - If the action is `Ignored`, feel free to add a specific reason why you want to ignore that in the next column
  - So for example, if I want to halve the amount Netflix transactions on my Chase card ending in 2211, the rule row would look like this
  - | if email contains |	if description contains |	if extra data contains |	then |	apply multiplier to amount |	apply multiplier to shared amount |	ignore reason |
    |-------------------|--------------------------|------------------------|------|-----------------------------|------------------------------------|---------------|
    |    chase          |     netflix              |     2211               | Spending |        0.5                     |                                    |               |

## Manual setup

<summary>Manual setup continued from simple setup (if you don't want to use the setup script)</summary>

<details>
1. Setup your transaction notifications as described above
2. Download [financial-transaction-mail-filters.xml](https://github.com/jeffreyfjohnson/gas-finance-tracker/blob/main/financial-transaction-mail-filters.xml) to setup the Gmail filters that will mark relevant emails with the `financial-transactions` label. These filters will also mark the emails as read and remove them from your main inbox, to avoid clogging up your email.
    - ⚠️⚠️⚠️ these email filters require **no forwarding of any emails**. If you get filters from someone else that forward to an unknown email address, remove the filters from your account and the person from your life
    - You can also do this (or really any) step manually if you choose. As long as an email has the `financial-transactions` label, it will be found by the script
3. Make a copy of this [Google Sheet](https://docs.google.com/spreadsheets/d/1Ulgv1zPzWj1FWTZlDs9SJcp0W7NUl14BVisanfR8qKs/copy). You can title it whatever you want, but don't change the name of the individual sheets within the spreadsheet
    - You will see a warning about copying an associated Google Apps Script. The script attached to this spreadsheet simply allows for easy ignoring of transactions. You can inspect it for safety, or immediately delete it if you wish. It is not necessary for the core functionality
5. Copy the spreadsheet ID from the URL. This is the long string of random letters and numbers in between `d/` and `/copy` or `/edit` in the top bar of your browser. For instance, the ID of the spreadsheet you just copied is `1Ulgv1zPzWj1FWTZlDs9SJcp0W7NUl14BVisanfR8qKs`. Make sure you omit the slashes. Paste this somewhere you can access it later.
    - If you want, you can add some categories you might want to categorize transactions as. You can add them in the `D` column of the `overview` sheet. `Groceries` and `Misc` are examples that I have added, but you don't need them
6. Go to the [latest release](https://github.com/jeffreyfjohnson/gas-finance-tracker/releases/latest) for this repo, and download `combined.js` to your computer    
7. Go to [https://script.google.com/home](https://script.google.com/home), and create a new project. If you have multiple Google accounts, make sure the selected user is the email your email notifications are being sent to.
8. Delete all the contents of the `Code.js` file, and paste **everything** from the `combined.js` file you just downloaded.
9. In the top bar of the Google Apps Script console, next to run and debug, select `getTransactionsForDay`, then press run
10. You will see a permission dialog. Click review permissions.
11. You will see a scary looking warning  
    <img width="644" alt="image" src="https://github.com/user-attachments/assets/1bf29ad7-434a-4567-a59e-a2cb5895cddd" />
12. ⚠️⚠️⚠️ If the email is not your email **stop immediately, and delete the GAS project. MAKE SURE THE EMAIL IS EXACTLY YOUR EMAIL WITH NO DEVIATIONS** 
13. If the email is your email, you have nothing to worry about. You are giving yourself access to all your data. That is fine. Click "Advanced", and then the "Continue to Untitled/whatever you named your project (unsafe)" link
14. Grant all the permissions, and then continue
15. You're almost there, but you will see an error at this point. To fix it, go to `Project Settings` in the left sidebar, scroll down, and add 2 script properties
    - property: `myEmail`, value: your actual email
    - property: `spreadsheetId`, value: the spreadsheet ID you remembered to copy and paste to a safe place earlier. If you forgot, don't worry, just go back to your copy of the spreadsheet and grab it from the URL  
      <img width="817" alt="image" src="https://github.com/user-attachments/assets/06f9707c-b3e6-48bf-8510-85653624f200" />

16. Save the properties, go back to the `Editor` via the left pane, click `Run` once again, and if you don't see any errors, you've done the hard part!
17. You can now set this up to run automatically. Go to the `Triggers` page from the left pane, click `Add Trigger`, and then select `getTransactionsForDay` as the function to run. You can elect to have it run every minute (completely excessive), hour (pretty reasonable), day, etc. Save this, and your financial transactions should start rolling in automatically!

</details>

## Advanced setup
Assuming you have some experience creating software, or are just darned persistent, it should be easy to see how you can adapt the setup instructions above if you want a little more control. If that's the case [clasp](https://github.com/google/clasp) makes it much easier to interact with a local repo via the command line


