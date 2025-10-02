"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "uz"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  uz: {
    // Navigation
    "nav.dashboard": "Bosh sahifa",
    "nav.tournaments": "Turnirlar",
    "nav.teams": "Jamoalar",
    "nav.store": "Do'kon",
    "nav.pricing": "Narxlar",
    "nav.logout": "Chiqish",
    "nav.login": "Kirish",
    "nav.upgrade": "Yangilash",
    "nav.chat": "Chat",
    "nav.admin": "Admin Panel",
    "nav.leaderboard": "Reyting Jadvali",

    // Dashboard
    "dashboard.welcome": "Xush kelibsiz",
    "dashboard.level": "Daraja",
    "dashboard.wins": "G'alabalar",
    "dashboard.winStreak": "G'alaba seriyasi",
    "dashboard.totalPoints": "Jami ochkolar",
    "dashboard.quickBattle": "Tez jang",
    "dashboard.tournaments": "Turnirlar",
    "dashboard.teamChat": "Jamoa chat",
    "dashboard.progress": "Taraqqiyot",
    "dashboard.recentActivity": "So'nggi faoliyat",
    "dashboard.myTeams": "Mening jamoalarim",
    "dashboard.noBattles": "Hali janglar yo'q! Faoliyatingizni ko'rish uchun birinchi jangni boshlang.",
    "dashboard.noTeams": "Siz hali hech qanday jamoaga qo'shilmagansiz!",
    "dashboard.startFirstBattle": "Birinchi jangni boshlash",
    "dashboard.createTeam": "Jamoa yaratish",
    "dashboard.browseTeams": "Jamoalarni ko'rish",
    "dashboard.liveChat": "Jonli Chat",

    "premium.unlockFeatures": "Premium Imkoniyatlarni Oching",
    "premium.upgradeDescription": "Barcha funksiyalar va maxsus kontentlarga kirish oling",
    "premium.upgradeNow": "Hozir Yangilash",

    // Chat
    "chat.title": "Jonli Chat",
    "chat.description": "Boshqa o'quvchilar bilan muloqot qiling",
    "chat.onlineUsers": "Onlayn Foydalanuvchilar",
    "chat.generalChat": "Umumiy Chat",
    "chat.typePlaceholder": "Xabar yozing...",
    "chat.send": "Yuborish",

    // Tournaments
    "tournaments.title": "Turnirlar",
    "tournaments.live": "Jonli Turnirlar",
    "tournaments.upcoming": "Kelayotgan Turnirlar",
    "tournaments.participants": "Ishtirokchilar",
    "tournaments.startBattle": "Jangni Boshlash",
    "tournaments.joinTournament": "Turniriga Qo'shilish",
    "tournaments.joined": "Qo'shilgan",
    "tournaments.prizePool": "Mukofot Fondi",

    // Teams
    "teams.title": "Jamoalar",
    "teams.myTeams": "Mening Jamoalarim",
    "teams.availableTeams": "Mavjud Jamoalar",
    "teams.createTeam": "Jamoa Yaratish",
    "teams.joinTeam": "Jamoaga Qo'shilish",
    "teams.members": "A'zolar",
    "teams.leader": "Rahbar",

    // Store
    "store.title": "Do'kon",
    "store.stickers": "Stikerlar",
    "store.premiumRequired": "Premium Kerak",
    "store.unlock": "Ochish",
    "store.upgradePrompt": "To'liq Do'konni Oching",

    // Pricing & Payment
    "pricing.title": "Narxlar",
    "pricing.freeWarrior": "Bepul Jangchi",
    "pricing.champion": "Chempion",
    "pricing.selectPlan": "Rejani Tanlash",
    "pricing.currentPlan": "Joriy Reja",
    "payment.title": "To'lov",
    "payment.cardNumber": "Karta Raqami",
    "payment.cardNumberPlaceholder": "1234 5678 9012 3456",
    "payment.expiryDate": "Amal Qilish Muddati",
    "payment.expiryPlaceholder": "MM/YY",
    "payment.cardholderName": "Karta Egasining Ismi",
    "payment.namePlaceholder": "To'liq ismingizni kiriting",
    "payment.processPayment": "To'lovni Amalga Oshirish",
    "payment.orderSummary": "Buyurtma Xulosasi",
    "payment.pendingApproval": "Admin tasdiqlashini kutmoqda",
    "payment.approvalMessage":
      "Sizning premium obunangiz admin tomonidan tasdiqlanmagan. Iltimos, admin tasdiqlashini kuting.",

    // Admin Panel
    "admin.title": "Admin Panel",
    "admin.dashboard": "Boshqaruv Paneli",
    "admin.users": "Foydalanuvchilar",
    "admin.subscriptions": "Obunalar",
    "admin.progress": "Taraqqiyot",
    "admin.tournaments": "Turnirlar",
    "admin.settings": "Sozlamalar",
    "admin.pendingApprovals": "Kutilayotgan Tasdiqlar",
    "admin.approveSubscription": "Obunani Tasdiqlash",
    "admin.rejectSubscription": "Obunani Rad Etish",

    // Progress & Leaderboard
    "progress.title": "Taraqqiyot",
    "progress.leaderboard": "Reyting Jadvali",
    "progress.topStudents": "Eng Yaxshi O'quvchilar",
    "progress.rank": "O'rin",
    "progress.student": "O'quvchi",
    "progress.points": "Ochkolar",
    "progress.subjects": "Fanlar",

    // Subjects
    "subjects.math": "Matematika",
    "subjects.physics": "Fizika",
    "subjects.chemistry": "Kimyo",
    "subjects.biology": "Biologiya",
    "subjects.history": "Tarix",
    "subjects.geography": "Geografiya",
    "subjects.literature": "Adabiyot",
    "subjects.english": "Ingliz tili",

    // Common
    "common.loading": "Yuklanmoqda...",
    "common.error": "Xato",
    "common.success": "Muvaffaqiyat",
    "common.cancel": "Bekor qilish",
    "common.save": "Saqlash",
    "common.delete": "O'chirish",
    "common.edit": "Tahrirlash",
    "common.create": "Yaratish",
    "common.back": "Orqaga",
    "common.next": "Keyingi",
    "common.previous": "Oldingi",
    "common.submit": "Yuborish",
    "common.confirm": "Tasdiqlash",
    "common.close": "Yopish",

    // Login Page Translations
    "login.title": "Kirish",
    "login.description": "Hisobingizga kiring va o'rganishni boshlang",
    "login.levelUp": "O'rganishni",
    "login.learning": "Yangi Darajaga Ko'taring",
    "login.heroDescription": "Turnirlar, jamoaviy janglar va jonli chat bilan bilimingizni sinab ko'ring",
    "login.continueWithGoogle": "Google bilan davom etish",
    "login.username": "Foydalanuvchi nomi",
    "login.password": "Parol",
    "login.loginAsAdmin": "Admin sifatida kirish",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
