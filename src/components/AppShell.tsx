import { useRef, type ReactNode } from "react";
import { artifacts, profiles } from "../game/content";
import type { Chapter, ChapterMeta, PageId, StoryState } from "../game/types";

const pageLabels: Record<PageId, string> = {
  mail: "星邮",
  home: "空间主页",
  space: "程澈的空间",
  album: "旧家相册",
  guestbook: "留言板",
  music: "音乐盒",
  group: "羽化测试群",
  profiles: "好友档案",
  cache: "H_404 缓存",
  migration: "遗留数据迁移"
};

const pageAddresses: Record<PageId, string> = {
  mail: "mail.xingyu.cn/inbox/legacy",
  home: "user.xingyu.cn/hegui",
  space: "user.xingyu.cn/hegui/blog/0317",
  album: "photo.xingyu.cn/hegui/old-home",
  guestbook: "user.xingyu.cn/hegui/guestbook",
  music: "music.xingyu.cn/hegui/playlist",
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
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

export const BrowserChrome = ({
  state,
  chapter,
  solved,
  total,
  onNavigate,
  onBack,
  onForward,
  canGoBack,
  canGoForward
}: BrowserChromeProps) => {
  const integrity = Math.round((solved / total) * 100);
  const tabs: PageId[] = ["mail", "space"];
  if (chapter.id >= 2) tabs.push("group", "profiles");
  if (chapter.id >= 3) tabs.push("cache");
  if (chapter.id >= 5) tabs.push("migration");
  const spacePages: PageId[] = ["home", "space", "album", "guestbook", "music"];
  const isSelected = (page: PageId) =>
    page === "space" ? spacePages.includes(state.activePage) : state.activePage === page;

  return (
    <header className="browser-chrome">
      <div className="browser-titlebar">
        <span className="browser-app">星海浏览器 6.2</span>
        <span>第 {chapter.id} 章 · {chapter.title}</span>
        <span className="window-controls" aria-hidden="true">— □ ×</span>
      </div>
      <div className="browser-tabs" role="tablist" aria-label="已打开页面">
        {tabs.map((page) => (
          <button
            key={page}
            role="tab"
            aria-selected={isSelected(page)}
            className={isSelected(page) ? "active" : ""}
            type="button"
            onClick={() => onNavigate(page)}
          >
            <span aria-hidden="true">{page === "space" ? "★" : page === "mail" ? "✉" : "▤"}</span>
            {pageLabels[page]}
          </button>
        ))}
      </div>
      <div className="address-row">
        <button type="button" aria-label="后退" onClick={onBack} disabled={!canGoBack}>←</button>
        <button type="button" aria-label="前进" onClick={onForward} disabled={!canGoForward}>→</button>
        <button type="button" aria-label="刷新当前页" onClick={() => window.location.reload()}>↻</button>
        <div className="address-field"><span>http://</span>{pageAddresses[state.activePage]}</div>
        <div className="core-progress" title="旧站镜像完整度" aria-label={`旧站镜像完整度 ${integrity}%`}>
          <span style={{ width: String(integrity) + "%" }} />
          <b>镜像 {integrity}%</b>
        </div>
      </div>
    </header>
  );
};

export const SpaceLayout = ({
  state,
  chapter,
  onNavigate,
  reviewingChapter,
  onReturnToMigration,
  children
}: {
  state: StoryState;
  chapter: ChapterMeta;
  onNavigate: (page: PageId) => void;
  reviewingChapter?: Chapter;
  onReturnToMigration?: () => void;
  children: ReactNode;
}) => {
  const displayChapter = chapter.id;
  const visitorTotal = displayChapter === 1 ? 2 : displayChapter === 2 ? 8 : 8 + state.attention;
  const visibleVisitors = displayChapter < 3 ? ["程砚"] : ["程砚", "纸鸢", "头像不可用"];
  const navItems: Array<{ label: string; page: PageId; activePages: PageId[]; className?: string }> = [
    { label: "主页", page: "home", activePages: ["home"] },
    { label: "日志", page: "space", activePages: ["space"] },
    {
      label: "相册",
      page: "album",
      activePages: ["album"]
    },
    {
      label: "留言板",
      page: displayChapter === 2 ? "group" : "guestbook",
      activePages: ["group", "guestbook"]
    },
    { label: "好友", page: "profiles", activePages: ["profiles"] },
    {
      label: "音乐盒",
      page: displayChapter === 3 ? "cache" : "music",
      activePages: ["cache", "music"]
    }
  ];
  if (displayChapter >= 4) {
    navItems.push({ label: "名籍", page: "migration", activePages: ["migration"], className: "forbidden" });
  }

  return (
    <div className={"space-page chapter-skin-" + displayChapter}>
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
          <h1>{displayChapter === 1 && !state.solvedPuzzleIds.includes("ch1-name") ? "鹤归的空间" : "程澈的空间"}</h1>
          <p>{displayChapter >= 4 ? "哥，这次你还要说不认我吗？" : "有些东西删掉了，也会回来。"}</p>
          <div className="retro-badges"><span>彩钻 LV3</span><span>音乐达人</span><span>空间龄 16 年</span></div>
        </div>
        <div className="space-weather">
          <strong>2010.08.27</strong>
          <span>夜 / 27℃</span>
        </div>
      </header>
      {reviewingChapter && onReturnToMigration && (
        <div className="review-banner" role="status">
          <span>正在回看第 {reviewingChapter} 章。已解开的题目和档案不会丢失。</span>
          <button type="button" onClick={onReturnToMigration}>返回迁移页</button>
        </div>
      )}
      <nav className="space-nav" aria-label="空间导航">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`${item.className ?? ""}${item.activePages.includes(state.activePage) ? " active" : ""}`.trim()}
            aria-current={item.activePages.includes(state.activePage) ? "page" : undefined}
            onClick={() => onNavigate(item.page)}
          >
            {item.label}
          </button>
        ))}
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
            <div><span>{chapter.date}</span><small>恢复队列：{chapter.objective}</small></div>
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
            <p>日志：{3 + displayChapter * 2}</p>
            <p>相片：{4 + state.collectedArtifactIds.length}</p>
            <p>好友：{displayChapter === 1 ? 6 : 7}</p>
          </section>
        </aside>
      </div>
      <footer className="space-footer">
        星语空间 © 2006–2011　关于我们　用户协议　违规举报
      </footer>
    </div>
  );
};

const archivePhotos = [
  { file: "sports-day-gap.jpg", title: "运动会看台", date: "2009-10-18" },
  { file: "family-old-home.jpg", title: "春节客厅", date: "2010-02-14" },
  { file: "school-gate-gap.jpg", title: "校门口", date: "2010-06-28" },
  { file: "balcony-gap.jpg", title: "旧家阳台", date: "2010-08-25" }
];

export const SpaceSectionArchive = ({
  page,
  state,
  chapter,
  onNavigate
}: {
  page: PageId;
  state: StoryState;
  chapter: ChapterMeta;
  onNavigate: (page: PageId) => void;
}) => {
  if (page === "home") {
    return (
      <section className="space-section-archive space-home-archive">
        <span className="archive-kicker">空间主页 / 镜像可读</span>
        <h1>鹤归最近又上线了</h1>
        <p>旧站导航已经恢复。每个栏目都有独立地址，访问记录也会写入浏览器的后退与前进历史。</p>
        <div className="archive-link-grid">
          <button type="button" onClick={() => onNavigate(chapter.page)}>
            <span>正在恢复</span><strong>第 {chapter.id} 章《{chapter.title}》</strong><small>{chapter.objective}</small>
          </button>
          <button type="button" onClick={() => onNavigate("album")}>
            <span>相册 4</span><strong>旧家</strong><small>四张照片的文件时间都被覆盖过</small>
          </button>
          <button type="button" onClick={() => onNavigate(state.chapter >= 2 ? "group" : "guestbook")}>
            <span>留言 {state.chapter >= 2 ? 7 : 1}</span><strong>羽化测试群</strong><small>{state.chapter >= 2 ? "七个账号留下了一条访问链" : "更多记录仍在恢复"}</small>
          </button>
        </div>
      </section>
    );
  }

  if (page === "space") {
    return (
      <section className="space-section-archive journal-archive">
        <span className="archive-kicker">日志 / 私密分类</span>
        <h1>已恢复日志</h1>
        <article>
          <div><strong>哥，如果你还记得我</strong><small>2010-08-27 03:17</small></div>
          <p>有些东西删掉了，也会回来。</p>
        </article>
        <article className="is-corrupt">
          <div><strong>装扮测试记录</strong><small>时间不可用</small></div>
          <p>正文已被七个不同账号覆盖。</p>
        </article>
        {chapter.page !== "space" && (
          <button className="retro-button" type="button" onClick={() => onNavigate(chapter.page)}>
            返回第 {chapter.id} 章调查页
          </button>
        )}
      </section>
    );
  }

  if (page === "album") {
    return (
      <section className="space-section-archive album-archive">
        <span className="archive-kicker">相册 / 旧家（4）</span>
        <h1>文件时间不可信，画面仍然可信</h1>
        <p>点击照片可查看原图。独立目录镜像保留了文件名、上传顺序与相机备注。</p>
        <div className="archive-photo-grid">
          {archivePhotos.map((photo) => {
            const src = `${import.meta.env.BASE_URL}assets/photos/${photo.file}`;
            return (
              <figure key={photo.file}>
                <a href={src} target="_blank" rel="noreferrer"><img src={src} width="1200" height="900" loading="lazy" alt={`${photo.title}旧照片，人物之间留有异常空位`} /></a>
                <figcaption><strong>{photo.title}</strong><span>{photo.date}</span></figcaption>
              </figure>
            );
          })}
        </div>
        <a className="retro-button subtle" href={`${import.meta.env.BASE_URL}archive/album-index.html`} target="_blank" rel="noreferrer">
          打开独立相册目录镜像
        </a>
      </section>
    );
  }

  if (page === "guestbook") {
    const unlocked = state.chapter >= 2;
    return (
      <section className="space-section-archive guestbook-archive">
        <span className="archive-kicker">留言板 / {unlocked ? "7 条可读" : "恢复率 8%"}</span>
        <h1>{unlocked ? "踩过的人留下了下一站" : "留言索引尚未恢复"}</h1>
        <div className="guestbook-lines">
          <p><strong>北窗：</strong>{unlocked ? "装扮包先交给鹤归。" : "装扮包先交给□□。"}</p>
          <p><strong>鹤归：</strong>{unlocked ? "我同桌接下一站。" : "该回复暂不可读。"}</p>
          <p><strong>系统：</strong>{unlocked ? "可见账号 7，访问记录 8。" : "需要先恢复羽化测试群。"}</p>
        </div>
        {unlocked ? (
          <a className="retro-button subtle" href={`${import.meta.env.BASE_URL}archive/yuhua-guestbook.txt`} target="_blank" rel="noreferrer">
            查看原始留言导出
          </a>
        ) : (
          <button className="retro-button" type="button" onClick={() => onNavigate(chapter.page)}>返回当前调查</button>
        )}
      </section>
    );
  }

  if (page === "music") {
    const unlocked = state.chapter >= 3;
    return (
      <section className="space-section-archive music-archive">
        <span className="archive-kicker">音乐盒 / 播放列表</span>
        <h1>第八首没有上传者</h1>
        <ol>
          <li><span>01</span><strong>晚安，世界</strong><small>夜曲FM</small></li>
          <li><span>02</span><strong>给忘摘镜头盖的人</strong><small>夜曲FM</small></li>
          <li className="is-corrupt"><span>08</span><strong>{unlocked ? "[无标题]" : "读取失败"}</strong><small>{unlocked ? "00:37 / 上传者为空" : "等待缓存恢复"}</small></li>
        </ol>
        {unlocked ? (
          <a className="retro-button subtle" href={`${import.meta.env.BASE_URL}archive/playlist.m3u`} target="_blank" rel="noreferrer">
            打开原始播放列表
          </a>
        ) : (
          <button className="retro-button" type="button" onClick={() => onNavigate(chapter.page)}>返回当前调查</button>
        )}
      </section>
    );
  }

  return (
    <section className="space-section-archive registry-preview">
      <span className="archive-kicker">名籍 / 权限不足</span>
      <h1>检测到一个没有姓名的槽位</h1>
      <p>迁移向导尚未开放。先完成第 {chapter.id} 章的名、形、缘恢复。</p>
      <button className="retro-button" type="button" onClick={() => onNavigate(chapter.page)}>返回当前调查</button>
    </section>
  );
};

export const MailArchive = ({ onBack }: { onBack: () => void }) => (
  <section className="standalone-archive">
    <span className="archive-kicker">已保存邮件 / 只读</span>
    <h1>您特别关心的用户“鹤归”更新了日志</h1>
    <p>原始发送时间同时显示为 2010-08-27 03:17 与今天 22:37。邮件头中的服务节点已于 2014 年注销。</p>
    <blockquote>《哥，如果你还记得我》</blockquote>
    <div className="button-row">
      <a className="retro-button subtle" href={`${import.meta.env.BASE_URL}archive/legacy-mail.eml`} target="_blank" rel="noreferrer">查看原始邮件头</a>
      <button className="retro-button" type="button" onClick={onBack}>返回当前调查页</button>
    </div>
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
  const hasXuAudio = state.collectedArtifactIds.includes("xu-audio");
  const hasLuqingDiary = state.collectedArtifactIds.includes("luqing-diary");

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="utility-drawer" onMouseDown={(event) => event.stopPropagation()} aria-label={mode === "evidence" ? "证据便签" : "设置"}>
        <header><h2>{mode === "evidence" ? "程砚的证据便签" : "游戏与存档设置"}</h2><button type="button" onClick={onClose}>×</button></header>
        {mode === "evidence" ? (
          <>
            <p className="drawer-intro">便签保存第一次读到的版本，不随现实改写。</p>
            {state.chapter >= 3 && (
              <section className="registry-progress" aria-label="开籍结局档案进度">
                <div><strong>《开籍》档案条件</strong><span>{Number(hasXuAudio) + Number(hasLuqingDiary)} / 2</span></div>
                <p className={hasXuAudio ? "is-found" : ""}>许妍的双声道录音：{hasXuAudio ? "已保存" : "第三章声道工具中可恢复"}</p>
                <p className={hasLuqingDiary ? "is-found" : ""}>陆青的纸质日记：{hasLuqingDiary ? "已保存" : state.chapter >= 4 ? "第四章顶部可保存" : "将在第四章出现"}</p>
              </section>
            )}
            <div className="artifact-list">
              {visibleArtifacts.map((artifact, index) => (
                <article key={artifact.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{artifact.label}</strong><p>{artifact.detail}</p></div>
                </article>
              ))}
            </div>
            <p className="artifact-count">已保存 {visibleArtifacts.length} / {artifacts.length} 份未被改写的记录</p>
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
            <details className="external-help">
              <summary>页面始终没有回应</summary>
              <p>下面的链接会离开叙事，并直接公开所有恢复步骤与结局条件。</p>
              <a href="./walkthrough.html" target="_blank" rel="noreferrer">打开调查者手册（含完整剧透）</a>
            </details>
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
  <nav className="utility-dock" aria-label="浏览器工具">
    <button type="button" onClick={onEvidence}><span>▣</span>证据 <b>{evidenceCount}</b></button>
    <button type="button" onClick={onAudio}><span>{audioEnabled ? "♫" : "♪"}</span>{audioEnabled ? "声音开" : "已静音"}</button>
    <button type="button" onClick={onSettings}><span>⚙</span>设置</button>
  </nav>
);
