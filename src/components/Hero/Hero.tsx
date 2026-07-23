import { useState } from "react";
import { Link } from "react-router-dom";
import { Info, Map, ShieldCheck, User, Volume2, VolumeX } from "lucide-react";
import { useI18n } from "../../i18n/I18nContext";
import { TurbineIcon } from "./TurbineIcon";
import * as notifySound from "../../firebase/notifySound";
import vestasLogo from "../../assets/vestas-logo-white.png";

const PILL_CLASS =
    "flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85 backdrop-blur-sm transition hover:bg-white/20 cursor-pointer";
const ICON_PILL_CLASS =
    "flex items-center justify-center rounded-full bg-white/10 p-2 text-white/85 backdrop-blur-sm transition hover:bg-white/20";

export function Hero({
    isAdmin,
    userName,
    onSignOut,
    onOpenAdminInfo,
}: {
    isAdmin: boolean;
    userName: string;
    onSignOut: () => void;
    onOpenAdminInfo: () => void;
}) {
    const { lang, setLang, t } = useI18n();
    const [muted, setMutedState] = useState(notifySound.isMuted());

    const toggleMute = () => {
        const next = !muted;
        notifySound.setMuted(next);
        setMutedState(next);
    };

    const handleChangeName = () => {
        if (window.confirm(t.signOutConfirm)) onSignOut();
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-dark to-blue-mid p-6">
            <TurbineIcon className="pointer-events-none absolute bottom-[-6%] left-[4%] w-[130px] text-white/10" />
            <TurbineIcon className="pointer-events-none absolute bottom-[-8%] left-[20%] w-[90px] text-white/[.16]" />
            <TurbineIcon className="pointer-events-none absolute right-[10%] bottom-[-6%] w-[160px] text-white/[.12]" />
            <TurbineIcon className="pointer-events-none absolute right-[26%] bottom-[-4%] w-[70px] text-white/[.18]" />

            <div className="relative z-10 mb-3 flex flex-wrap items-center gap-2">
                <div
                    className="flex gap-0.5 rounded-full border border-white/30 bg-white/10 p-0.5 backdrop-blur-sm"
                    role="group"
                    aria-label="Language / Lingua"
                >
                    {(["it", "en"] as const).map(code => (
                        <button
                            key={code}
                            type="button"
                            onClick={() => setLang(code)}
                            className={`rounded-full px-3 py-1.5 font-heading text-[0.68rem] font-bold tracking-wide transition ${
                                lang === code
                                    ? "bg-accent text-white"
                                    : "text-white/75 hover:text-white"
                            }`}
                        >
                            {code.toUpperCase()}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={toggleMute}
                    title={t.soundToggleTitle}
                    className={ICON_PILL_CLASS}
                >
                    {muted ? (
                        <VolumeX
                            size={16}
                            strokeWidth={2}
                        />
                    ) : (
                        <Volume2
                            size={16}
                            strokeWidth={2}
                        />
                    )}
                </button>
                <Link
                    to="/mappa"
                    className={PILL_CLASS}
                >
                    <Map
                        size={14}
                        strokeWidth={2}
                        className="text-white/75"
                    />
                    <span className="text-white">Mappa Materiali</span>
                </Link>

                <button
                    type="button"
                    onClick={handleChangeName}
                    title={t.changeNameTitle}
                    className={PILL_CLASS}
                >
                    <User
                        size={14}
                        strokeWidth={2}
                    />
                    <span>{userName}</span>
                </button>

                {isAdmin && (
                    <>
                        <a
                            href="https://console.firebase.google.com/project/vestas-warehouse-hub/firestore/data/~2Fallowed"
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t.adminApproveTitle}
                            className={PILL_CLASS}
                        >
                            <ShieldCheck
                                size={14}
                                strokeWidth={2}
                            />
                            <span>{t.adminApproveLabel}</span>
                        </a>
                        <button
                            type="button"
                            onClick={onOpenAdminInfo}
                            title={t.adminInfoTitle}
                            className={ICON_PILL_CLASS}
                        >
                            <Info
                                size={16}
                                strokeWidth={2}
                            />
                        </button>
                    </>
                )}
            </div>

            {/* <img
                className="absolute inset-0 h-full w-full object-cover opacity-20"
                src={heroBg}
                alt=""
            /> */}

            <div className="relative z-10 flex flex-col lg:flex-row-reverse lg:justify-between lg:items-center gap-5 py-6">
                <div className="rounded-lg py-3">
                    <img
                        src={vestasLogo}
                        alt="Vestas"
                        className="h-10 w-auto"
                    />
                </div>
                <div>
                    <h1 className="font-heading text-3xl font-black text-white">
                        Warehouse{" "}
                        <span className="font-light text-accent">
                            HUB Organizer
                        </span>
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-white/80">
                        {t.heroSubtitle}
                    </p>
                </div>
            </div>
        </div>
    );
}
