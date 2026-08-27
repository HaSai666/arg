import type { ReactNode } from "react";
import type { Profile } from "../game/types";

export const ArchiveNotice = ({ children }: { children: ReactNode }) => (
  <div className="archive-notice">
    <span aria-hidden="true">◆</span>
    <div>{children}</div>
  </div>
);

export const MemoryFlash = ({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) => (
  <aside className="memory-flash">
    <span>{label}</span>
    <p>{children}</p>
  </aside>
);

export interface ChatMessage {
  sender: string;
  time: string;
  text: string;
  tone?: "system" | "warning" | "normal";
}

export const ChatLog = ({ messages }: { messages: ChatMessage[] }) => (
  <div className="chat-log" aria-label="聊天记录">
    {messages.map((message, index) => (
      <div className={"chat-line " + (message.tone ?? "normal")} key={message.time + index}>
        <span className="chat-time">{message.time}</span>
        <strong>{message.sender}</strong>
        <p>{message.text}</p>
      </div>
    ))}
  </div>
);

export const ChapterComplete = ({
  nextTitle,
  onAdvance
}: {
  nextTitle: string;
  onAdvance: () => void;
}) => (
  <div className="chapter-complete">
    <span className="stamp">本章记录已恢复</span>
    <h3>新的页面正在从缓存中出现。</h3>
    <button className="primary-cta" type="button" onClick={onAdvance}>
      进入{nextTitle}
    </button>
  </div>
);

export const ProfileChip = ({ profile }: { profile: Profile }) => (
  <div className="profile-chip">
    <span className="mini-avatar" style={{ background: profile.color }}>{profile.initials}</span>
    <span>
      <strong>{profile.nickname}</strong>
      <small>{profile.status}</small>
    </span>
  </div>
);

export const FauxPhoto = ({
  title,
  date,
  variant,
  note
}: {
  title: string;
  date: string;
  variant: "sports" | "newyear" | "gate" | "balcony" | "shadows";
  note: string;
}) => {
  const photoSources = {
    sports: "assets/photos/sports-day-gap.jpg",
    newyear: "assets/photos/family-old-home.jpg",
    gate: "assets/photos/school-gate-gap.jpg",
    balcony: "assets/photos/balcony-gap.jpg",
    shadows: "assets/photos/group-eight-shadows.jpg"
  } as const;

  return (
    <figure className="faux-photo">
      <img
        src={`${import.meta.env.BASE_URL}${photoSources[variant]}`}
        width="1200"
        height={variant === "sports" ? 800 : 900}
        loading="lazy"
        decoding="async"
        draggable="false"
        alt={note}
      />
      <figcaption>
        <strong>{title}</strong>
        <span>{date}</span>
        <small>{note}</small>
      </figcaption>
    </figure>
  );
};

export const OptionalEvidence = ({
  title,
  description,
  collected,
  onCollect,
  image,
  disabled = false,
  disabledLabel = "尚未满足保存条件"
}: {
  title: string;
  description: string;
  collected: boolean;
  onCollect: () => void;
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
  disabled?: boolean;
  disabledLabel?: string;
}) => (
  <aside className={`${collected ? "optional-evidence collected" : "optional-evidence"}${image ? " has-media" : ""}`}>
    {image && (
      <figure className="evidence-photo">
        <a href={image.src} target="_blank" rel="noreferrer" title="打开扫描件原图">
          <img src={image.src} width="1200" height="800" loading="lazy" decoding="async" alt={image.alt} />
        </a>
        <figcaption>{image.caption}</figcaption>
      </figure>
    )}
    <div>
      <span>可选档案</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <button className="retro-button" type="button" onClick={onCollect} disabled={collected || disabled}>
      {collected ? "已保存到证据便签" : disabled ? disabledLabel : "保存这份档案"}
    </button>
  </aside>
);
