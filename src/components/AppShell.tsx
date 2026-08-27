import { useRef, type ReactNode } from "react";
import { artifacts, profiles } from "../game/content";
import type { ChapterMeta, PageId, StoryState } from "../game/types";

const pageLabels: Record<PageId, string> = {
  mail: "星邮",
  space: "程澈的空间",
  album: "旧家相册",
  group: "羽化测试群",
  profiles: "好友档案",
  cache: "H_404 缓存",
  migration: "遗留数据迁移"
};

const pageAddresses: Record<PageId, string> = {
  mail: "mail.xingyu.cn/inbox/legacy",
  space: "user.xingyu.cn/hegui",
  album: "photo.xingyu.cn/hegui/old-home",
  group: "group.xingyu.cn/yuhua-test",
  profiles: "friend.xingyu.cn/hegui/list",
  cache: "mirror.h404.local/snapshot/20100827",
  migration: "legacy.xingyu.cn/account/resolve"
};

export const OpeningMail = ({
  onStart
}: {
  onStart: (audioEnabled: boolean) => void;
}) => (
  <main className="opening-screen">
    <div className="opening-window">
      <header className="mail-brand">
        <div className="star-logo" aria-hidden="true">★</div>
        <div>
          <strong>星邮</strong>
          <span>程砚 &lt;chengyan_archive@xingyu.cn&gt;</span>
        </div>
      </header>
      <div className="mail-grid">
        <aside>
          <button className="active" type="button">收件箱 <b>1</b></button>
          <button type="button">星标邮件</button>
          <button type="button">已发送</button>
          <button type="button">旧平台通知</button>
        </aside>
        <article className="mail-message">
          <span className="legacy-pill">旧平台自动通知</span>
          <h1>您特别关心的用户“鹤归”更新了日志</h1>
          <dl>
            <div><dt>发件人</dt><dd>星语空间 &lt;service@xingyu.cn&gt;</dd></div>
            <div><dt>时间</dt><dd>今天 22:37</dd></div>
            <div><dt>原始时间</dt><dd>2010-08-27 03:17</dd></div>
          </dl>
          <div className="mail-body">
            <p>你在 2010 年将“鹤归”设为特别关心。该用户刚刚更新了私密日志：</p>
            <blockquote>《哥，如果你还记得我》</blockquote>
            <p className="mail-warning">该链接来自已经停止运营的旧版空间服务。</p>
          </div>
          <div className="opening-actions">
            <button className="primary-cta" type="button" onClick={() => onStart(true)}>
              打开日志并开启声音
            </button>
            <button className="retro-button subtle" type="button" onClick={() => onStart(false)}>
              静音进入
            </button>
          </div>
        </article>
      </div>
      <footer>
        <strong>内容提示：</strong>本作涉及记忆抹除、家庭冲突与轻度恐怖，无血腥画面。故事及平台均为虚构。
      </footer>
    </div>
  </main>
);

interface BrowserChromeProps {
  state: StoryState;
  chapter: ChapterMeta;
  solved: number;
  total: number;
  onNavigate: (page: PageId) => void;
}

export const BrowserChrome = ({
  state,
  chapter,
  solved,
  total,
  onNavigate
}: BrowserChromeProps) => {
  const tabs: PageId[] = ["mail", "space"];
  if (state.chapter >= 2) tabs.push("group", "profiles");
  if (state.chapter >= 3) tabs.push("cache");
  if (state.chapter >= 5) tabs.push("migration");

  return (
    <header className="browser-chrome">
      <div className="browser-titlebar">
        <span className="browser-app">星海浏览器 6.2</span>
        <span>第 {state.chapter} 章 · {chapter.title}</span>
        <span className="window-controls" aria-hidden="true">— □ ×</span>
      </div>
      <div className="browser-tabs" role="tablist" aria-label="已打开页面">
        {tabs.map((page) => (
          <button
            key={page}
            role="tab"
            aria-selected={state.activePage === page}
            className={state.activePage === page ? "active" : ""}
            type="button"
            onClick={() => onNavigate(page)}
          >
            <span aria-hidden="true">{page === "space" ? "★" : page === "mail" ? "✉" : "▤"}</span>
            {pageLabels[page]}
          </button>
        ))}
      </div>
      <div className="address-row">
        <button type="button" aria-label="后退" disabled>←</button>
        <button type="button" aria-label="前进" disabled>→</button>
        <button type="button" aria-label="刷新当前页" onClick={() => window.location.reload()}>↻</button>
        <div className="address-field"><span>http://</span>{pageAddresses[state.activePage]}</div>
        <div className="core-progress" title="已解决主谜题">
          <span style={{ width: String(Math.round((solved / total) * 100)) + "%" }} />
          <b>{solved}/{total}</b>
        </div>
      </div>
    </header>
  );
};

export const SpaceLayout = ({
  state,
  chapter,
  children
}: {
  state: StoryState;
  chapter: ChapterMeta;
  children: ReactNode;
}) => {
  const visitorTotal = state.chapter === 1 ? 2 : state.chapter === 2 ? 8 : 8 + state.attention;
  const visibleVisitors = state.chapter < 3 ? ["程砚"] : ["程砚", "纸鸢", "头像不可用"];

  return (
    <div className={"space-page chapter-skin-" + state.chapter}>
      <header className="space-cover">
        <div className="space-avatar" aria-label="程澈的虚构头像">
          <img
            src={`${import.meta.env.BASE_URL}assets/photos/hegui-avatar.jpg`}
            width="560"
            height="560"
            alt="程澈在旧电脑桌前拍摄的低清自拍"
          />
          <small>QY</small>
        </div>
        <div className="space-identity">
          <h1>{state.chapter === 1 && !state.solvedPuzzleIds.includes("ch1-name") ? "鹤归的空间" : "程澈的空间"}</h1>
          <p>{state.chapter >= 4 ? "哥，这次你还要说不认我吗？" : "有些东西删掉了，也会回来。"}</p>
          <div className="retro-badges"><span>彩钻 LV3</span><span>音乐达人</span><span>空间龄 16 年</span></div>
        </div>
        <div className="space-weather">
          <strong>2010.08.27</strong>
          <span>夜 / 27℃</span>
        </div>
      </header>
      <nav className="space-nav" aria-label="空间导航">
        {["主页", "日志", "相册", "留言板", "好友", "音乐盒"].map((label, index) => (
          <a key={label} href="#game-content" className={index === 1 ? "active" : ""}>{label}</a>
        ))}
        {state.chapter >= 4 && <a href="#game-content" className="forbidden">名籍</a>}
      </nav>
      <div className="space-columns">
        <aside className="left-rail">
          <section className="retro-module profile-module">
            <h2>个人档</h2>
            <dl>
              <div><dt>昵称</dt><dd>鹤归</dd></div>
              <div><dt>性别</dt><dd>男</dd></div>
              <div><dt>家乡</dt><dd>数据不可用</dd></div>
              <div><dt>生日</dt><dd>1997.06.18</dd></div>
            </dl>
          </section>
          <section className="retro-module">
            <h2>空间心情</h2>
            <p className="mood">“不要把真名写给陌生人。”</p>
            <small>更新于 16 年前</small>
          </section>
          <section className="retro-module ad-module" aria-label="时代广告">
            <span>装扮商城</span>
            <strong>夏日星空皮肤</strong>
            <small>限时免费试用</small>
          </section>
        </aside>

        <main className="content-column" id="game-content">
          <div className="chapter-ribbon">
            <div><span>第 {chapter.id} 章</span><strong>《{chapter.title}》</strong></div>
            <div><span>{chapter.date}</span><small>当前目标：{chapter.objective}</small></div>
          </div>
          {children}
        </main>

        <aside className="right-rail">
          <section className="retro-module visitor-module">
            <h2>最近访客 <span>{visitorTotal}</span></h2>
            <ul>
              {visibleVisitors.map((visitor, index) => (
                <li key={visitor + index}>
                  <span className={visitor === "头像不可用" ? "visitor-avatar blank" : "visitor-avatar"}>{visitor.slice(0, 1)}</span>
                  <span><strong>{visitor}</strong><small>{index === 0 ? "刚刚" : "时间不可用"}</small></span>
                </li>
              ))}
            </ul>
            {visitorTotal > visibleVisitors.length && <p className="visitor-gap">另有 {visitorTotal - visibleVisitors.length} 条记录无法显示</p>}
          </section>
          <section className="retro-module music-module">
            <h2>音乐盒</h2>
            <div className="music-display"><span>▶</span><div><strong>未命名_03</strong><small>03:17 / 循环播放</small></div></div>
            <div className="equalizer" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
          </section>
          <section className="retro-module">
            <h2>统计</h2>
            <p>日志：{3 + state.chapter * 2}</p>
            <p>相片：{4 + state.collectedArtifactIds.length}</p>
            <p>好友：{state.chapter === 1 ? 6 : 7}</p>
          </section>
        </aside>
      </div>
      <footer className="space-footer">
        星语空间 © 2006–2011　关于我们　用户协议　违规举报
      </footer>
    </div>
  );
};

export const MailArchive = ({ onBack }: { onBack: () => void }) => (
  <section className="standalone-archive">
    <span className="archive-kicker">已保存邮件 / 只读</span>
    <h1>您特别关心的用户“鹤归”更新了日志</h1>
    <p>原始发送时间同时显示为 2010-08-27 03:17 与今天 22:37。邮件头中的服务节点已于 2014 年注销。</p>
    <blockquote>《哥，如果你还记得我》</blockquote>
    <button className="retro-button" type="button" onClick={onBack}>返回当前调查页</button>
  </section>
);

export const ProfileArchive = ({
  state,
  onBack
}: {
  state: StoryState;
  onBack: () => void;
}) => (
  <section className="standalone-archive">
    <span className="archive-kicker">好友档案 / 已恢复 {state.chapter >= 2 ? 7 : 1}</span>
    <h1>羽化测试群人物索引</h1>
    <div className="profile-archive-grid">
      {profiles
        .filter((profile) => state.chapter >= 2 || profile.id === "cheng-che")
        .map((profile) => (
          <article key={profile.id}>
            <span className="archive-avatar" style={{ background: profile.color }}>{profile.initials}</span>
            <div><h2>{profile.nickname}</h2><p>{profile.name} · {profile.age2010} 岁 · {profile.role}</p></div>
            <blockquote>{profile.signature}</blockquote>
            <small>{profile.evidence}</small>
          </article>
        ))}
    </div>
    <button className="retro-button" type="button" onClick={onBack}>返回当前调查页</button>
  </section>
);

export const StaticArchive = ({
  page,
  onBack
}: {
  page: PageId;
  onBack: () => void;
}) => (
  <section className="standalone-archive">
    <span className="archive-kicker">{pageLabels[page]} / 历史快照</span>
    <h1>此页面的当前版本已保存到证据便签</h1>
    <p>现实改写后的版本可能与第一次访问不同。主线调查位于当前章节标签中。</p>
    <button className="retro-button" type="button" onClick={onBack}>返回当前调查页</button>
  </section>
);

interface UtilityDrawerProps {
  open: boolean;
  mode: "evidence" | "settings";
  state: StoryState;
  onClose: () => void;
  onRestartChapter: () => void;
  onToggleMotion: () => void;
  onToggleContrast: () => void;
  onExport: () => void;
  onImport: (raw: string) => boolean;
  onReset: () => void;
}

export const UtilityDrawer = ({
  open,
  mode,
  state,
  onClose,
  onRestartChapter,
  onToggleMotion,
  onToggleContrast,
  onExport,
  onImport,
  onReset
}: UtilityDrawerProps) => {
  const importRef = useRef<HTMLInputElement>(null);
  if (!open) return null;
  const visibleArtifacts = artifacts.filter((artifact) => state.collectedArtifactIds.includes(artifact.id));

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="utility-drawer" onMouseDown={(event) => event.stopPropagation()} aria-label={mode === "evidence" ? "证据便签" : "设置"}>
        <header><h2>{mode === "evidence" ? "程砚的证据便签" : "游戏与存档设置"}</h2><button type="button" onClick={onClose}>×</button></header>
        {mode === "evidence" ? (
          <>
            <p className="drawer-intro">便签保存第一次读到的版本，不随现实改写。</p>
            <div className="artifact-list">
              {visibleArtifacts.map((artifact, index) => (
                <article key={artifact.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{artifact.label}</strong><p>{artifact.detail}</p></div>
                </article>
              ))}
            </div>
            <p className="artifact-count">已保存 {visibleArtifacts.length} / {artifacts.length} 份核心档案</p>
          </>
        ) : (
          <div className="settings-list">
            <button type="button" onClick={onToggleMotion}><span>降低动态效果</span><b>{state.reducedMotion ? "已开启" : "关闭"}</b></button>
            <button type="button" onClick={onToggleContrast}><span>高对比模式</span><b>{state.highContrast ? "已开启" : "关闭"}</b></button>
            <button type="button" onClick={onRestartChapter}><span>重玩当前章节</span><b>从章首快照恢复</b></button>
            <button type="button" onClick={onExport}><span>导出存档</span><b>JSON 文件</b></button>
            <button type="button" onClick={() => importRef.current?.click()}><span>导入存档</span><b>本地校验</b></button>
            <input
              ref={importRef}
              hidden
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void file.text().then((raw) => {
                  window.alert(onImport(raw) ? "存档导入成功。" : "存档无效，未更改当前进度。");
                });
              }}
            />
            <button
              className="danger-setting"
              type="button"
              onClick={() => {
                if (window.confirm("确认删除全部本地进度？此操作不可撤销。")) onReset();
              }}
            >
              <span>删除全部进度</span><b>重新开始</b>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

interface UtilityDockProps {
  evidenceCount: number;
  audioEnabled: boolean;
  onEvidence: () => void;
  onSettings: () => void;
  onAudio: () => void;
}

export const UtilityDock = ({
  evidenceCount,
  audioEnabled,
  onEvidence,
  onSettings,
  onAudio
}: UtilityDockProps) => (
  <nav className="utility-dock" aria-label="游戏工具">
    <button type="button" onClick={onEvidence}><span>▣</span>证据 <b>{evidenceCount}</b></button>
    <button type="button" onClick={onAudio}><span>{audioEnabled ? "♫" : "♪"}</span>{audioEnabled ? "声音开" : "已静音"}</button>
    <button type="button" onClick={onSettings}><span>⚙</span>设置</button>
    <a href="./walkthrough.html" target="_blank" rel="noreferrer"><span>?</span>通关秘籍</a>
  </nav>
);
