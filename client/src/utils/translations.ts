// Define translation interface for type safety
interface TranslationMap {
  [key: string]: {
    [key: string]: string;
  };
}

// Create a translations object with keys for each translatable string
const translations: TranslationMap = {
  // Navigation & Headings
  "welcome_title": {
    "EN": "Welcome to InsureClaim",
    "ES": "Bienvenido a InsureClaim",
    "FR": "Bienvenue sur InsureClaim",
    "DE": "Willkommen bei InsureClaim",
    "ZH": "欢迎使用InsureClaim",
    "JA": "InsureClaimへようこそ"
  },
  "help": {
    "EN": "Help",
    "ES": "Ayuda",
    "FR": "Aide",
    "DE": "Hilfe",
    "ZH": "帮助",
    "JA": "ヘルプ"
  },
  "recall_documents": {
    "EN": "Recall Documents",
    "ES": "Recuperar Documentos",
    "FR": "Rappeler Documents",
    "DE": "Dokumente Abrufen",
    "ZH": "恢复文档",
    "JA": "書類の呼び出し"
  },
  "personal_info": {
    "EN": "Personal Information",
    "ES": "Información Personal",
    "FR": "Informations Personnelles",
    "DE": "Persönliche Informationen",
    "ZH": "个人信息",
    "JA": "個人情報"
  },
  "personal_info_desc": {
    "EN": "Please provide your personal information to help us process your claim accurately.",
    "ES": "Por favor, proporcione su información personal para ayudarnos a procesar su reclamo con precisión.",
    "FR": "Veuillez fournir vos informations personnelles pour nous aider à traiter votre réclamation avec précision.",
    "DE": "Bitte geben Sie Ihre persönlichen Daten an, damit wir Ihren Anspruch korrekt bearbeiten können.",
    "ZH": "请提供您的个人信息，以帮助我们准确处理您的索赔。",
    "JA": "正確に請求を処理するために、個人情報をご提供ください。"
  },
  "room_selection": {
    "EN": "Room Selection",
    "ES": "Selección de Habitaciones",
    "FR": "Sélection des Pièces",
    "DE": "Raumauswahl",
    "ZH": "房间选择",
    "JA": "部屋の選択"
  },
  "item_details": {
    "EN": "Item Details",
    "ES": "Detalles del Artículo",
    "FR": "Détails de l'Article",
    "DE": "Artikeldetails",
    "ZH": "物品详情",
    "JA": "アイテムの詳細"
  },
  "review_items": {
    "EN": "Review Items",
    "ES": "Revisar Artículos",
    "FR": "Vérifier les Articles",
    "DE": "Artikel überprüfen",
    "ZH": "审查物品",
    "JA": "アイテムの確認"
  },
  "choose_template": {
    "EN": "Choose Template",
    "ES": "Elegir Plantilla",
    "FR": "Choisir un Modèle",
    "DE": "Vorlage auswählen",
    "ZH": "选择模板",
    "JA": "テンプレートを選択"
  },
  
  // Form Labels
  "full_name": {
    "EN": "Full Name",
    "ES": "Nombre Completo",
    "FR": "Nom Complet",
    "DE": "Vollständiger Name",
    "ZH": "全名",
    "JA": "氏名"
  },
  "full_name_placeholder": {
    "EN": "John Doe",
    "ES": "Juan Pérez",
    "FR": "Jean Dupont",
    "DE": "Max Mustermann",
    "ZH": "张三",
    "JA": "山田太郎"
  },
  "email": {
    "EN": "Email",
    "ES": "Correo Electrónico",
    "FR": "Email",
    "DE": "E-Mail",
    "ZH": "电子邮件",
    "JA": "メールアドレス"
  },
  "phone": {
    "EN": "Phone Number",
    "ES": "Número de Teléfono",
    "FR": "Numéro de Téléphone",
    "DE": "Telefonnummer",
    "ZH": "电话号码",
    "JA": "電話番号"
  },
  "address": {
    "EN": "Street Address",
    "ES": "Dirección",
    "FR": "Adresse",
    "DE": "Straßenadresse",
    "ZH": "街道地址",
    "JA": "住所"
  },
  "city": {
    "EN": "City",
    "ES": "Ciudad",
    "FR": "Ville",
    "DE": "Stadt",
    "ZH": "城市",
    "JA": "市区町村"
  },
  "state": {
    "EN": "State/Province",
    "ES": "Estado/Provincia",
    "FR": "État/Province",
    "DE": "Bundesland/Provinz",
    "ZH": "州/省",
    "JA": "都道府県"
  },
  "zip_code": {
    "EN": "Zip/Postal Code",
    "ES": "Código Postal",
    "FR": "Code Postal",
    "DE": "Postleitzahl",
    "ZH": "邮政编码",
    "JA": "郵便番号"
  },
  "country": {
    "EN": "Country",
    "ES": "País",
    "FR": "Pays",
    "DE": "Land",
    "ZH": "国家",
    "JA": "国"
  },
  "policy_number": {
    "EN": "Policy Number (optional)",
    "ES": "Número de Póliza (opcional)",
    "FR": "Numéro de Police (facultatif)",
    "DE": "Policennummer (optional)",
    "ZH": "保单号码 (可选)",
    "JA": "保険証券番号（任意）"
  },
  "policy_number_placeholder": {
    "EN": "POL-12345678",
    "ES": "POL-12345678",
    "FR": "POL-12345678",
    "DE": "POL-12345678",
    "ZH": "POL-12345678",
    "JA": "POL-12345678"
  },
  "property_address": {
    "EN": "Property Address",
    "ES": "Dirección de la Propiedad",
    "FR": "Adresse de la Propriété",
    "DE": "Immobilienadresse",
    "ZH": "房产地址",
    "JA": "物件住所"
  },
  "street_address": {
    "EN": "Street Address",
    "ES": "Dirección",
    "FR": "Adresse",
    "DE": "Straßenadresse",
    "ZH": "街道地址",
    "JA": "町名・番地"
  },
  "street_address_placeholder": {
    "EN": "123 Main St",
    "ES": "123 Calle Principal",
    "FR": "123 Rue Principale",
    "DE": "123 Hauptstraße",
    "ZH": "123 主街道",
    "JA": "123 メイン通り"
  },
  "city_placeholder": {
    "EN": "Anytown",
    "ES": "Cualquier Ciudad",
    "FR": "Ville Quelconque",
    "DE": "Irgendstadt",
    "ZH": "任何城市",
    "JA": "どこか市"
  },
  "state_placeholder": {
    "EN": "California",
    "ES": "California",
    "FR": "Californie",
    "DE": "Kalifornien",
    "ZH": "加利福尼亚",
    "JA": "カリフォルニア"
  },
  "zip_code_placeholder": {
    "EN": "12345",
    "ES": "12345",
    "FR": "12345",
    "DE": "12345",
    "ZH": "12345",
    "JA": "12345"
  },
  "country_placeholder": {
    "EN": "United States",
    "ES": "Estados Unidos",
    "FR": "États-Unis",
    "DE": "Vereinigte Staaten",
    "ZH": "美国",
    "JA": "アメリカ合衆国"
  },
  "saving": {
    "EN": "Saving...",
    "ES": "Guardando...",
    "FR": "Sauvegarde...",
    "DE": "Speicherung...",
    "ZH": "保存中...",
    "JA": "保存中..."
  },
  "continue_to_room_selection": {
    "EN": "Continue to Room Selection",
    "ES": "Continuar a Selección de Habitaciones",
    "FR": "Continuer à la Sélection des Pièces",
    "DE": "Weiter zur Raumauswahl",
    "ZH": "继续到房间选择",
    "JA": "部屋の選択へ進む"
  },
  
  // Room names
  "living_room": {
    "EN": "Living Room",
    "ES": "Sala de Estar",
    "FR": "Salon",
    "DE": "Wohnzimmer",
    "ZH": "客厅",
    "JA": "リビングルーム"
  },
  "kitchen": {
    "EN": "Kitchen",
    "ES": "Cocina",
    "FR": "Cuisine",
    "DE": "Küche",
    "ZH": "厨房",
    "JA": "キッチン"
  },
  "master_bedroom": {
    "EN": "Master Bedroom",
    "ES": "Dormitorio Principal",
    "FR": "Chambre Principale",
    "DE": "Hauptschlafzimmer",
    "ZH": "主卧室",
    "JA": "主寝室"
  },
  "bathroom": {
    "EN": "Bathroom",
    "ES": "Baño",
    "FR": "Salle de Bain",
    "DE": "Badezimmer",
    "ZH": "浴室",
    "JA": "バスルーム"
  },
  "garage": {
    "EN": "Garage",
    "ES": "Garaje",
    "FR": "Garage",
    "DE": "Garage",
    "ZH": "车库",
    "JA": "ガレージ"
  },
  
  // Buttons
  "continue": {
    "EN": "Continue",
    "ES": "Continuar",
    "FR": "Continuer",
    "DE": "Weiter",
    "ZH": "继续",
    "JA": "続ける"
  },
  "back": {
    "EN": "Back",
    "ES": "Atrás",
    "FR": "Retour",
    "DE": "Zurück",
    "ZH": "返回",
    "JA": "戻る"
  },
  "save": {
    "EN": "Save",
    "ES": "Guardar",
    "FR": "Enregistrer",
    "DE": "Speichern",
    "ZH": "保存",
    "JA": "保存"
  },
  "add": {
    "EN": "Add",
    "ES": "Añadir",
    "FR": "Ajouter",
    "DE": "Hinzufügen",
    "ZH": "添加",
    "JA": "追加"
  },
  "edit": {
    "EN": "Edit",
    "ES": "Editar",
    "FR": "Modifier",
    "DE": "Bearbeiten",
    "ZH": "编辑",
    "JA": "編集"
  },
  "delete": {
    "EN": "Delete",
    "ES": "Eliminar",
    "FR": "Supprimer",
    "DE": "Löschen",
    "ZH": "删除",
    "JA": "削除"
  },
  
  // Item form
  "item_name": {
    "EN": "Item Name",
    "ES": "Nombre del Artículo",
    "FR": "Nom de l'Article",
    "DE": "Artikelname",
    "ZH": "物品名称",
    "JA": "アイテム名"
  },
  "category": {
    "EN": "Category",
    "ES": "Categoría",
    "FR": "Catégorie",
    "DE": "Kategorie",
    "ZH": "类别",
    "JA": "カテゴリ"
  },
  "description": {
    "EN": "Description",
    "ES": "Descripción",
    "FR": "Description",
    "DE": "Beschreibung",
    "ZH": "描述",
    "JA": "説明"
  },
  "cost": {
    "EN": "Estimated Cost",
    "ES": "Costo Estimado",
    "FR": "Coût Estimé",
    "DE": "Geschätzte Kosten",
    "ZH": "估计成本",
    "JA": "推定コスト"
  },
  "quantity": {
    "EN": "Quantity",
    "ES": "Cantidad",
    "FR": "Quantité",
    "DE": "Menge",
    "ZH": "数量",
    "JA": "数量"
  },
  "purchase_date": {
    "EN": "Purchase Date",
    "ES": "Fecha de Compra",
    "FR": "Date d'Achat",
    "DE": "Kaufdatum",
    "ZH": "购买日期",
    "JA": "購入日"
  },
  
  // Footer
  "privacy": {
    "EN": "Privacy",
    "ES": "Privacidad",
    "FR": "Confidentialité",
    "DE": "Datenschutz",
    "ZH": "隐私",
    "JA": "プライバシー"
  },
  "terms": {
    "EN": "Terms",
    "ES": "Términos",
    "FR": "Conditions",
    "DE": "Bedingungen",
    "ZH": "条款",
    "JA": "利用規約"
  },
  "copyright": {
    "EN": "© 2023 InsureClaim",
    "ES": "© 2023 InsureClaim",
    "FR": "© 2023 InsureClaim",
    "DE": "© 2023 InsureClaim",
    "ZH": "© 2023 InsureClaim",
    "JA": "© 2023 InsureClaim"
  }
};

// Create a function to get translations based on language code
export function getTranslation(key: string, language: string = "EN"): string {
  // If translation exists, return it, otherwise return the key itself
  if (translations[key] && translations[key][language]) {
    return translations[key][language];
  }
  
  // Fallback to English if the language doesn't have a translation
  if (translations[key] && translations[key]["EN"]) {
    return translations[key]["EN"];
  }
  
  // If no translation exists at all, return the key
  return key;
}

// Create a hook for use in components
export function useTranslation(language: string = "EN") {
  return {
    t: (key: string) => getTranslation(key, language)
  };
}

// Export the translations for direct access if needed
export default translations;