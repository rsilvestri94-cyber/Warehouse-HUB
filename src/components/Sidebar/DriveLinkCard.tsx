import { FolderOpen } from "lucide-react";

const DRIVE_URL =
    "https://drive.google.com/drive/folders/1Yn9h4TgcS0un8Kup4xU272mG4LCnwjPH";

export function DriveLinkCard() {
    return (
        <a
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-grey-line bg-white p-4 transition hover:border-blue-mid hover:bg-grey-bg"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-mid/10 text-blue-mid">
                <FolderOpen size={20} />
            </div>
            <div className="min-w-0">
                <div className="font-heading text-sm font-bold text-ink">
                    Documenti condivisi
                </div>
                <div className="truncate text-xs text-ink/50">
                    Apri la cartella Drive ↗
                </div>
            </div>
        </a>
    );
}
