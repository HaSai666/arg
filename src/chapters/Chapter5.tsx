import { useMemo, useState } from "react";
import { endings } from "../game/content";
import type { EndingId, StoryState } from "../game/types";

interface Chapter5Props {
  state: StoryState;
  chooseEnding: (ending: EndingId) => void;
  revisitChoice: () => void;
}

const endingCopy: Record<EndingId, { title: string; paragraphs: string[]; finalLine: string }> = {
  return: {
    title: "归人：欢迎回家",
    paragraphs: [
      "迁移完成后，家庭群突然多出一个名为“程澈”的成年成员。母亲抱怨他周末又不回家吃饭，聊天记录向前延伸了十六年。",
      "程砚记得那十六年，也记得自己曾经忘记过它们。程澈发来一段语音，第一声“哥”属于他，第二个呼吸却来自许妍的录音。",
      "新生成的家庭合照里只有三个人。玻璃倒影里却站着第四个。"
    ],
    finalLine: "今日访客：2　列表中仅显示：程澈"
  },
  seal: {
    title: "封名：从未发生",
    paragraphs: [
      "程澈的姓名被重新拆散，照片退回空位，星语空间返回 404。程砚第二天醒来，只记得昨晚整理了一批无用的旧数据。",
      "母亲来家里吃饭，熟练地摆出三副碗筷。程砚问第三副是谁的，她愣了一会儿，把碗收回橱柜。",
      "浏览器历史已经清空，但收藏夹里留着一个没有标题的链接。"
    ],
    finalLine: "您已经访问过这个不存在的空间 8 次。"
  },
  exchange: {
    title: "换籍：弟，如果你还记得我",
    paragraphs: [
      "迁移系统接受了程砚的姓名、照片与全部关系。家庭记录里只剩下程澈，他顺利长大，拥有一段没有哥哥的童年。",
      "几天后，程澈收到一封来自停运平台的异常通知。他完全不认识发件人，却对“阿砚”这个昵称产生无法解释的心悸。",
      "邮件标题与十六年前只有一个字不同。"
    ],
    finalLine: "《弟，如果你还记得我》"
  },
  open_registry: {
    title: "开籍：所有人都应被记住",
    paragraphs: [
      "唐雨、何简、陆青，以及缓存中更多没有资料卡的人同时重新进入索引。学校多出班级，旧楼多出住户，家庭相册出现彼此冲突的童年。",
      "没有人能够证明哪些人生原本存在。星语空间的注册数持续增长，越过城市人口、户籍历史与所有墓碑的总和。",
      "第八位访客终于不再需要借用一个人的名字。它拥有了所有名字。"
    ],
    finalLine: "让每一次心情，都有回应。"
  }
};

export default function Chapter5({ state, chooseEnding, revisitChoice }: Chapter5Props) {
  const [pending, setPending] = useState<EndingId | null>(null);
  const canOpen = state.collectedArtifactIds.includes("xu-audio") &&
    state.collectedArtifactIds.includes("luqing-diary");
  const selectedDefinition = endings.find((ending) => ending.id === pending);
  const ending = state.ending ? endingCopy[state.ending] : null;

  const coda = useMemo(() => {
    const lines: string[] = [];
    if (state.trustWenLan > 0) lines.push("纸鸢最后留下一句：“至少这一次，是你自己决定记住谁。”");
    if (state.attention >= 8) lines.push("页面关闭前，你看见自己的头像在访客列表里又刷新了七次。");
    if (state.endingHistory.length > 1) lines.push("迁移系统记录：当前访客已经做出过不同选择。");
    return lines;
  }, [state.attention, state.endingHistory.length, state.trustWenLan]);

  if (ending && state.ending) {
    return (
      <div className={"ending-screen ending-" + state.ending}>
        <span className="ending-kicker">星语空间 · 数据迁移完成</span>
        <h2>{ending.title}</h2>
        {state.ending === "return" && (
          <figure className="ending-photo">
            <img
              src={`${import.meta.env.BASE_URL}assets/photos/ending-return.jpg`}
              width="1200"
              height="800"
              alt="程砚、成年程澈和母亲的家庭合影，身后窗户里反射出第四个人"
            />
            <figcaption><span>family_final_recovered.jpg</span><strong>人脸检测：3</strong></figcaption>
          </figure>
        )}
        {ending.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {coda.map((line) => <p className="ending-coda" key={line}>{line}</p>)}
        <blockquote>{ending.finalLine}</blockquote>
        <div className="ending-actions">
          <button className="primary-cta" type="button" onClick={revisitChoice}>返回迁移前快照</button>
          <a className="retro-button subtle" href="./walkthrough.html" target="_blank" rel="noreferrer">查看通关秘籍</a>
        </div>
      </div>
    );
  }

  return (
    <div className="chapter-view migration-theme">
      <header className="migration-header">
        <div>
          <span>星语空间遗留账号迁移向导</span>
          <h2>检测到身份凭证冲突</h2>
        </div>
        <strong>处理进度 97%</strong>
      </header>

      <div className="credential-grid">
        <div><span>名</span><strong>程澈</strong><small>来源：日志与输入记录</small></div>
        <div><span>形</span><strong>恢复中 92%</strong><small>来源：四张家庭照片</small></div>
        <div><span>缘</span><strong>哥哥：程砚</strong><small>来源：当前访客确认</small></div>
      </div>

      <div className="final-messages">
        <p><strong>鹤归：</strong>你只要承认我是你弟弟，我就能回家。</p>
        <p><strong>纸鸢：</strong>你承认的也许不是他。</p>
        <p><strong>北窗缓存：</strong>存在，本来就是被足够多的人相信。</p>
      </div>

      <h3 className="choice-heading">选择怎样处置“名、形、缘”</h3>
      <div className="ending-choice-grid">
        {endings.map((definition) => {
          const locked = definition.id === "open_registry" && !canOpen;
          return (
            <button
              key={definition.id}
              className={pending === definition.id ? "ending-card selected" : "ending-card"}
              type="button"
              disabled={locked}
              onClick={() => setPending(definition.id)}
            >
              <span>《{definition.title}》</span>
              <strong>{definition.verb}</strong>
              <p>{definition.summary}</p>
              <small>{locked ? "需要许妍录音与陆青纸质日记" : definition.consequence}</small>
            </button>
          );
        })}
      </div>

      {selectedDefinition && pending && (
        <div className="choice-confirm" role="dialog" aria-live="polite">
          <h3>确认执行《{selectedDefinition.title}》？</h3>
          <p>{selectedDefinition.consequence}</p>
          <p>系统无法证明聊天窗口里的“程澈”是真是假。此选择会保存，但可从迁移前快照返回。</p>
          <div className="button-row">
            <button className="primary-cta" type="button" onClick={() => chooseEnding(pending)}>执行迁移</button>
            <button className="retro-button subtle" type="button" onClick={() => setPending(null)}>重新考虑</button>
          </div>
        </div>
      )}
    </div>
  );
}
