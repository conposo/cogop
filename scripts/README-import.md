# Bulgarian Churches Import Script

This script imports the Bulgarian Church of God of Prophecy churches from the `COGOP-churches` directory into the Firestore database.

## Features

- 🏢 Imports church data for 10 Bulgarian churches
- 📸 Uploads church images to Firebase Storage
- 🔥 Saves church records to Firestore
- ✅ Error handling and progress reporting
- 🌍 Includes Bulgarian church names and locations

## Prerequisites

1. **Firebase Configuration**: Ensure your Firebase environment variables are set
2. **Node.js**: The script requires Node.js to run
3. **Firebase Project**: You need a Firebase project with Firestore and Storage enabled

## Setup

1. **Environment Variables**: Create a `.env.local` file (if not already exists) with your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. **Permissions**: Ensure your Firebase project has the following enabled:
   - Firestore Database
   - Firebase Storage
   - Proper security rules for the `churches` collection

## Usage

Run the import script from the project root:

```bash
# Load environment variables and run the script
node -r dotenv/config scripts/import-bulgarian-churches.js

# Or if you have environment variables set in your shell:
node scripts/import-bulgarian-churches.js
```

## What the Script Does

1. **Reads Church Data**: Processes 10 Bulgarian churches from predefined data
2. **Uploads Images**: Finds and uploads church images (JPG, JPEG, PNG) to Firebase Storage
3. **Creates Church Records**: Adds complete church documents to Firestore with:
   - Church name (in Bulgarian)
   - Location (city, state, country)
   - Default service times (Sunday 10:00, Wednesday 19:00)
   - Standard programs (Youth Ministry, Children's Ministry, etc.)
   - Image URL (if image was uploaded)
   - Metadata (created/updated timestamps)

## Churches Included

- Църква Божия на пророчеството - Богданци
- Църква Божия на пророчеството - Бяла
- Църква Божия на пророчеството - Две могили
- Църква Божия на пророчеството - Златарица
- Църква Божия на пророчеството - Лом
- Църква Божия на пророчеството - с. Козяк
- Църква Божия на пророчеството - Сливен 1
- Църква Божия на пророчеството - Сливен 2
- Църква Божия на пророчеството - Сливо поле
- Църква Божия на пророчеството - Ямбол

## Output

The script provides detailed console output including:
- ✅ Success messages for each church processed
- 📸 Image upload confirmations
- ❌ Error messages if something goes wrong
- 📊 Final summary with success/error counts

## Data Structure

Each church record includes:
- `name`: Church name in Bulgarian
- `city`, `state`, `country`: Location information
- `denomination`: "Church of God of Prophecy"
- `description`: Descriptive text in Bulgarian
- `servicesTimes`: Array with service days and times
- `programs`: Array of ministry programs
- `imageUrl`: URL to uploaded church image (if available)
- `isActive`: Set to `true`
- Timestamps and creator information

## Troubleshooting

1. **Environment Variables**: Ensure all Firebase config variables are set
2. **Permissions**: Check Firebase project permissions for Firestore and Storage
3. **File Paths**: Verify the `COGOP-churches` directory exists and contains church folders
4. **Network**: Ensure internet connection for Firebase uploads

## Security Notes

- The script uses the Firebase Admin SDK configuration
- Ensure your Firebase security rules allow writes to the `churches` collection
- Images are uploaded to `churches/{churchName}/` in Firebase Storage
- All operations are logged for audit purposes 