import type { Lang } from "../types/lang";

export interface Strings {
  heroSubtitle: string;
  toolsLabel: string;
  toolsHint: string;
  todoTitle: string;
  todoPlaceholder: string;
  todoAddTitle: string;
  priorityLabel: string;
  printLabel: string;
  printOldLabel: string;
  printOldSub: string;
  printNewsLabel: string;
  printNewsSub: string;
  archiveEmbedLabel: string;
  archiveEmbedHint: string;
  archiveEmbedNote: string;
  archiveEmbedOpen: string;
  archiveLauncherTitle: string;
  archiveOpenBtn: string;
  archiveOverlayTitle: string;
  archiveOverlayTab: string;
  archiveCloseTitle: string;
  archiveCloseLabel: string;
  addToolTile: string;
  formTitleLabel: string;
  formDescLabel: string;
  formLinkLabel: string;
  formTypeLabel: string;
  formColorLabel: string;
  formSave: string;
  formAdd: string;
  formCancel: string;
  formTitlePlaceholder: string;
  formDescPlaceholder: string;
  gearTitle: string;
  dragTitle: string;
  emptyTodos: string;
  deleteTaskTitle: string;
  markDoneTitle: string;
  markUndoTitle: string;
  noDescription: string;
  progress: (done: number, total: number) => string;
  signedInAs: string;
  soundToggleTitle: string;
  changeNameTitle: string;
  namePromptText: string;
  defaultUserName: string;
  signOutTitle: string;
  signOutConfirm: string;
  authChecking: string;
  authSignInMsg: string;
  authSignInBtn: string;
  authAltMethod: string;
  authInAppTitle: string;
  authInAppSub: string;
  authOpenChrome: string;
  authCopyLink: string;
  authCopied: string;
  authTryAnyway: string;
  adminApproveTitle: string;
  adminApproveLabel: string;
  adminInfoTitle: string;
  adminInfoHeading: string;
  adminStep1T: string;
  adminStep1B: string;
  adminStep2T: string;
  adminStep2B: string;
  adminStep3T: string;
  adminStep3B: string;
  adminWarnT: string;
  adminWarnB: string;
  adminNote1T: string;
  adminNote1B: string;
  adminNote2T: string;
  adminNote2B: string;
  authRequestBtn: string;
  authRequestSent: string;
  authPendingTitle: string;
  authPendingSub: string;
  authRetry: string;
  authSignOut: string;
  authErrorTitle: string;
  authPopupBlocked: string;
  authGeneric: string;
  commentsTitle: string;
  commentPlaceholder: string;
  commentAddBtn: string;
  deleteCommentTitle: string;
  emptyComments: string;
  syncIdle: string;
  syncSaving: string;
  syncSynced: string;
  syncError: string;
  syncOffline: string;
}

export const I18N: Record<Lang, Strings> = {
  it: {
    heroSubtitle:
      "Punto di accesso unico a: archivio DN e attività, conferma accettazione materiali, documenti su Drive, pictures/items/tools su Mega, materiali in uscita Service Point, portale EOS e generatore di etichette per la stampa dei Work Order.",
    toolsLabel: "Tools",
    toolsHint:
      "trascina i riquadri per riordinarli · premi l'icona ⚙ per modificarli",
    todoTitle: "To-Do List",
    todoPlaceholder: "Nuova attività...",
    todoAddTitle: "Aggiungi attività",
    priorityLabel: "Priorità",
    printLabel: "Stampa Work Order",
    printOldLabel: "Stampa Work Order — Old",
    printOldSub: "Archivio vecchio",
    printNewsLabel: "Stampa Work Order — New",
    printNewsSub: "Archivio DN track.2",
    archiveEmbedLabel: "Archivio DN — Tracking",
    archiveEmbedHint:
      "l'archivio si apre a schermo intero sopra l'hub — la pagina resta esattamente dov'era",
    archiveEmbedNote:
      "Richiede di essere già connessi con un account Google autorizzato ad accedere al foglio.",
    archiveEmbedOpen: "Apri a schermo intero ↗",
    archiveLauncherTitle: "Archivio DN e attività",
    archiveOpenBtn: "Apri l'archivio",
    archiveOverlayTitle: "Archivio DN — Tracking",
    archiveOverlayTab: "Apri in una scheda ↗",
    archiveCloseTitle: "Chiudi (Esc)",
    archiveCloseLabel: "Chiudi",
    addToolTile: "Aggiungi strumento",
    formTitleLabel: "Titolo",
    formDescLabel: "Descrizione",
    formLinkLabel: "Link",
    formTypeLabel: "Tipo",
    formColorLabel: "Colore",
    formSave: "Salva",
    formAdd: "Aggiungi",
    formCancel: "Annulla",
    formTitlePlaceholder: "Nome dello strumento",
    formDescPlaceholder: "Breve descrizione",
    gearTitle: "Modifica questo strumento",
    dragTitle: "Trascina per riordinare",
    emptyTodos: "Nessuna attività. Aggiungine una qui sopra.",
    deleteTaskTitle: "Elimina attività",
    markDoneTitle: "Segna come completata",
    markUndoTitle: "Segna come da fare",
    noDescription: "Nessuna descrizione.",
    progress: (done, total) => `${done} / ${total} completate`,
    signedInAs: "Firmato come",
    soundToggleTitle: "Suono notifiche (attiva/disattiva)",
    changeNameTitle: "Cambia nome",
    namePromptText: "Come vuoi firmare le tue attività e i tuoi commenti?",
    defaultUserName: "Anonimo",
    signOutTitle: "Esci dall'account",
    signOutConfirm: "Vuoi uscire dall'hub?",
    authChecking: "Verifica in corso…",
    authSignInMsg: "Accedi con il tuo account Google per continuare.",
    authSignInBtn: "Accedi con Google",
    authAltMethod: "Non si apre nulla? Prova il metodo alternativo",
    authInAppTitle: "Apri in Chrome per accedere",
    authInAppSub:
      "Hai aperto il link dentro un'app (WhatsApp, Instagram…). Google non consente l'accesso da questi browser interni, quindi l'hub va aperto nel browser vero del telefono.",
    authOpenChrome: "Apri in Chrome",
    authCopyLink: "Copia il link",
    authCopied: "Link copiato — incollalo in Chrome",
    authTryAnyway: "Provo lo stesso",
    adminApproveTitle: "Gestisci gli accessi (Firebase)",
    adminApproveLabel: "Accessi",
    adminInfoTitle: "Come gestire gli accessi",
    adminInfoHeading: "Gestione accessi",
    adminStep1T: "Il collega accede",
    adminStep1B:
      'Entra con Google e vede "In attesa di autorizzazione" con la sua email a schermo. Può premere "Richiedi accesso" per mandartela via email.',
    adminStep2T: "Tu lo aggiungi",
    adminStep2B:
      'Pillola ACCESSI → "+ Aggiungi documento" → ID documento = la sua email → campo name (string) col suo nome → Salva.',
    adminStep3T: "Lui entra",
    adminStep3B:
      'Preme "Riprova" sulla sua schermata: entra subito, senza rifare l\'accesso.',
    adminWarnT: "Email sempre in minuscolo",
    adminWarnB:
      "L'hub cerca l'email tutta minuscola. Mario.Rossi@gmail.com non viene trovato: scrivi mario.rossi@gmail.com.",
    adminNote1T: "Revocare:",
    adminNote1B: "elimina il suo documento da allowed. Esce alla prima ricarica.",
    adminNote2T: "Nuovo amministratore:",
    adminNote2B:
      "aggiungi al suo documento il campo admin (boolean) = true. Vedrà questi pulsanti.",
    authRequestBtn: "Richiedi accesso",
    authRequestSent: "Email aperta — premi Invia per mandare la richiesta",
    authPendingTitle: "In attesa di autorizzazione",
    authPendingSub: "Questo account non è ancora abilitato all'hub:",
    authRetry: "Riprova",
    authSignOut: "Esci",
    authErrorTitle: "Accesso non riuscito",
    authPopupBlocked:
      "Il browser ha bloccato la finestra di accesso. Consenti i popup per questo sito e riprova.",
    authGeneric: "Si è verificato un errore durante l'accesso. Riprova.",
    commentsTitle: "Commenti",
    commentPlaceholder: "Scrivi un appunto...",
    commentAddBtn: "Aggiungi",
    deleteCommentTitle: "Elimina commento",
    emptyComments: "Nessun commento. Scrivine uno qui sopra.",
    syncIdle: "",
    syncSaving: "Salvataggio...",
    syncSynced: "Sincronizzato",
    syncError: "Sync non disponibile — salvo solo su questo browser",
    syncOffline: "Sincronizzazione non configurata — solo su questo browser",
  },
  en: {
    heroSubtitle:
      "Single access point for: DN & activity archive, material acceptance confirmation, Drive documents, Mega pictures/items/tools, outgoing Service Point materials, the EOS portal, and the Work Order print-label generator.",
    toolsLabel: "Tools",
    toolsHint: "drag the tiles to reorder them · press the ⚙ icon to edit them",
    todoTitle: "To-Do List",
    todoPlaceholder: "New task...",
    todoAddTitle: "Add task",
    priorityLabel: "Priority",
    printLabel: "Print Work Order",
    printOldLabel: "Print Work Order — Old",
    printOldSub: "Old archive",
    printNewsLabel: "Print Work Order — New",
    printNewsSub: "DN track.2 archive",
    archiveEmbedLabel: "DN Archive — Tracking",
    archiveEmbedHint:
      "the archive opens full-screen over the hub — the page stays exactly where it was",
    archiveEmbedNote:
      "Requires being signed in with a Google account authorized to access the sheet.",
    archiveEmbedOpen: "Open full screen ↗",
    archiveLauncherTitle: "DN & activity archive",
    archiveOpenBtn: "Open the archive",
    archiveOverlayTitle: "DN Archive — Tracking",
    archiveOverlayTab: "Open in a tab ↗",
    archiveCloseTitle: "Close (Esc)",
    archiveCloseLabel: "Close",
    addToolTile: "Add tool",
    formTitleLabel: "Title",
    formDescLabel: "Description",
    formLinkLabel: "Link",
    formTypeLabel: "Type",
    formColorLabel: "Color",
    formSave: "Save",
    formAdd: "Add",
    formCancel: "Cancel",
    formTitlePlaceholder: "Tool name",
    formDescPlaceholder: "Short description",
    gearTitle: "Edit this tool",
    dragTitle: "Drag to reorder",
    emptyTodos: "No tasks yet. Add one above.",
    deleteTaskTitle: "Delete task",
    markDoneTitle: "Mark as done",
    markUndoTitle: "Mark as to-do",
    noDescription: "No description.",
    progress: (done, total) => `${done} / ${total} completed`,
    signedInAs: "Signed in as",
    soundToggleTitle: "Notification sound (on/off)",
    changeNameTitle: "Change name",
    namePromptText: "What name should sign your tasks and comments?",
    defaultUserName: "Anonymous",
    signOutTitle: "Sign out",
    signOutConfirm: "Sign out of the hub?",
    authChecking: "Checking…",
    authSignInMsg: "Sign in with your Google account to continue.",
    authSignInBtn: "Sign in with Google",
    authAltMethod: "Nothing opens? Try the alternative method",
    authInAppTitle: "Open in Chrome to sign in",
    authInAppSub:
      "You opened this link inside an app (WhatsApp, Instagram…). Google doesn't allow sign-in from these in-app browsers, so the hub needs the phone's real browser.",
    authOpenChrome: "Open in Chrome",
    authCopyLink: "Copy the link",
    authCopied: "Link copied — paste it into Chrome",
    authTryAnyway: "Let me try anyway",
    adminApproveTitle: "Manage access (Firebase)",
    adminApproveLabel: "Access",
    adminInfoTitle: "How to manage access",
    adminInfoHeading: "Access management",
    adminStep1T: "Your colleague signs in",
    adminStep1B:
      'They sign in with Google and see "Waiting for authorization" with their email on screen. They can press "Request access" to email it to you.',
    adminStep2T: "You add them",
    adminStep2B:
      'ACCESS pill → "+ Add document" → Document ID = their email → field name (string) with their name → Save.',
    adminStep3T: "They get in",
    adminStep3B:
      'They press "Try again" on their screen: they\'re in straight away, no need to sign in again.',
    adminWarnT: "Email always lowercase",
    adminWarnB:
      "The hub looks the email up in lowercase. Mario.Rossi@gmail.com won't be found: write mario.rossi@gmail.com.",
    adminNote1T: "To revoke:",
    adminNote1B: "delete their document from allowed. They're out on the next reload.",
    adminNote2T: "New admin:",
    adminNote2B:
      "add the field admin (boolean) = true to their document. They'll see these buttons.",
    authRequestBtn: "Request access",
    authRequestSent: "Email opened — press Send to submit the request",
    authPendingTitle: "Waiting for authorization",
    authPendingSub: "This account isn't approved for the hub yet:",
    authRetry: "Try again",
    authSignOut: "Sign out",
    authErrorTitle: "Sign-in failed",
    authPopupBlocked:
      "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
    authGeneric: "Something went wrong while signing in. Please try again.",
    commentsTitle: "Comments",
    commentPlaceholder: "Write a note...",
    commentAddBtn: "Add",
    deleteCommentTitle: "Delete comment",
    emptyComments: "No comments yet. Write one above.",
    syncIdle: "",
    syncSaving: "Saving...",
    syncSynced: "Synced",
    syncError: "Sync unavailable — saving to this browser only",
    syncOffline: "Sync not configured — this browser only",
  },
};
