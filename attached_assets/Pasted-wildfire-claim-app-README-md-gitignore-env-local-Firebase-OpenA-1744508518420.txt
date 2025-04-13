wildfire-claim-app/
├── README.md
├── .gitignore
├── .env.local                   # Firebase + OpenAI keys, API URLs
├── firebase.json                # Firebase config
├── firebaserc                   # Firebase project aliases
├── package.json
├── tsconfig.json                # Optional: TypeScript setup
├── next.config.js
│
├── public/                      # Static assets (logos, icons)
│
├── data/                        # Static fallback JSON files
│   └── item_prices.json
│
├── scripts/                     # Deployment / setup scripts
│   └── deploy.sh
│
├── lib/                         # Shared utilities
│   ├── firebase.ts              # Firebase client config
│   ├── currency.ts              # Currency conversion logic
│   ├── ai.ts                    # OpenAI functions
│   ├── schema.ts                # DB schema types
│   └── pdf.ts                   # PDF export logic
│
├── pages/                       # Next.js routes
│   ├── index.tsx                # Welcome page (language, currency)
│   ├── home.tsx                 # Room selection
│   ├── form.tsx                 # Item form
│   ├── summary.tsx             # Item list + export
│   └── api/                     # API routes (for Firebase / AI / PDF)
│       ├── estimate.ts
│       ├── export-pdf.ts
│       ├── suggest-items.ts
│       └── upload.ts
│
├── components/                  # Shared UI components
│   ├── Layout.tsx
│   ├── RoomChecklist.tsx
│   ├── ItemForm.tsx
│   ├── ItemSummary.tsx
│   ├── LanguageSelector.tsx
│   └── CurrencySelector.tsx
│
├── styles/                      # Global Tailwind + custom styles
│   └── globals.css
│
├── backend/                     # Firebase Functions (Jacob + Duy)
│   ├── index.ts                 # Entry point for Cloud Functions
│   ├── blurImage.ts             # Cloudinary or Canvas-based
│   ├── estimateValue.ts         # Static or OpenAI-enhanced
│   ├── promptSuggestions.ts     # OpenAI room → item logic
│   └── firestore.rules          # Firestore security rules
│
├── storage.rules                # Firebase Storage security
├── firestore.indexes.json       # Firebase indexes (if needed)
└── firestore.rules              # Firebase Firestore rules