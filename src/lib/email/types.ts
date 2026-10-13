// What a bonus hands to the shared email layer. The layer adds the branded shell, the
// "bridge to HireTrack" block, the footer, the plain-text version and the unsubscribe link.
export type BonusEmailContent = {
  subject: string;
  preheader: string;          // the grey preview line shown next to the subject in inboxes
  html: string;               // inner body HTML only. Escape every dynamic value with esc().
  text: string;               // plain-text version of the same body
  attachments?: { filename: string; content: string; contentType?: string }[]; // text files only (CSV, TXT, ICS...)
};

// A bonus's email builder gets the (untrusted) payload the browser sent and MUST re-validate it
// and recompute any numbers on the server. Return null if the payload is unusable; the shared
// layer then sends the generic "here is your bonus" email instead.
export type BonusEmailBuilder = (payload: unknown) => BonusEmailContent | null;
