
#!/bin/bash
# Build and deploy the application

# Build the Next.js app
npm run build

# Deploy to Firebase
firebase deploy
