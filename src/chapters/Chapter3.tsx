import { useState } from "react";
import { ChapterComplete, ChatLog, FauxPhoto, OptionalEvidence } from "../components/StoryBits";
import {
  CheckSetPuzzle,
  OrderPuzzle,
  PuzzleFrame,
  SingleChoicePuzzle,
  type OrderItem
} from "../components/PuzzleKit";
import type { ChapterViewProps } from "./types";

const timelineItems: OrderItem[] = [
  { id: "record", label: "夜曲FM 开始录音", clue: "原始设备时间 00:03，无校时偏差" },
  { id: "photo", label: "逆光℃ 上传照片", clue: "相机比服务器慢 4 分钟；记录为 00:01" },
  { id: "cache", label: "H_404 保存缓存", clue: "电脑比服务器快 3 分钟；记录为 00:10" },
  { id: "logout", label: "纸鸢退出群聊", clue: "手机短信证明真实时间为 00:08" },
  { id: "trail", label: "七个头像依次访问", clue: "服务器统一记录 00:09–00:11" }
];

export default function Chapter3({
  state,
  isSolved,
  solve,
  requestHint,
  adjustTrust,
  canAdvance,
  onAdvance
}: ChapterViewProps) {
  const solvedTimeline = isSolved("ch3-timeline");
  const solvedLanguage = isSolved("ch3-language");
  const solvedSlot = isSolved("ch3-slot");
  const audioCollected = isSolved("optional-xu-audio");
  const [phase, setPhase] = useState(0);

  return (
    <div className="chapter-view cache-theme">
      <header className="cache-header">
        <code>mirror.h404.local / snapshot / 2010-08-27</code>
        <span>只读缓存 · 最后校验失败</span>
      </header>

      <FauxPhoto
        title="IMG_0827.JPG"
        date="2010-08-27 00:01（相机时间）"
        variant="shadows"
        note="画面中有七个人形，却在地面留下八道影子。"
      />

      <PuzzleFrame
        id="ch3-timeline"
        title="校正五条不可能的访问记录"
        eyebrow="谜题 07 / 时间线"
        state={state}
        solved={solvedTimeline}
        hints={[
          "先把相机加 4 分钟，把何简的电脑减 3 分钟。",
          "真实时间依次是 00:03、00:05、00:07、00:08、00:09。",
          "顺序：录音、照片、缓存、纸鸢退出、七头像访问。"
        ]}
        onHint={requestHint}
        onSkip={() => solve("ch3-timeline", ["eighth-track"])}
        solvedText="七人可解释的活动之外，剩下一条连续访客轨迹。"
      >
        <OrderPuzzle
          items={timelineItems}
          correctOrder={["record", "photo", "cache", "logout", "trail"]}
          instruction="校正设备误差后，按真实发生时间排列。"
          onCorrect={() => solve("ch3-timeline", ["eighth-track"])}
        />
      </PuzzleFrame>

      {solvedTimeline && (
        <PuzzleFrame
          id="ch3-language"
          title="标记不是原账号写下的留言"
          eyebrow="谜题 08 / 说话方式"
          state={state}
          solved={solvedLanguage}
          hints={[
            "异常不会创造新句子，并且回避使用第一人称“我”。",
            "留意把两个人签名直接拼到一起的句子。",
            "应标记北窗头像的“照片不会说谎……”和纸鸢头像的“晚安，世界……”两条。"
          ]}
          onHint={requestHint}
          onSkip={() => {
            adjustTrust(1);
            solve("ch3-language");
          }}
          solvedText="闻岚确认：它不是假装成谁，而是在学习怎样成为“我”。"
        >
          <CheckSetPuzzle
            instruction="勾选你认为由第八位访客拼接的两条留言。"
            items={[
              { id: "a", author: "半糖", text: "我刚才一直在写作业，真的没回那句。" },
              { id: "b", author: "北窗", text: "照片不会说谎，有些东西删掉了也会回来。" },
              { id: "c", author: "H_404", text: "我对过 hash，文件今晚被改了两次。" },
              { id: "d", author: "纸鸢", text: "晚安，世界。名字不要随便写给别人看。" },
              { id: "e", author: "夜曲FM", text: "我把原始录音传给何简了。" }
            ]}
            correctIds={["b", "d"]}
            onCorrect={() => {
              adjustTrust(1);
              solve("ch3-language");
            }}
          />
        </PuzzleFrame>
      )}

      {solvedLanguage && (
        <>
          <article className="source-window">
            <div className="source-title">view-source://dongtian-beta/layout.js</div>
            <pre>
              <code>{"slot[1] = uid(\"beichuang\");\nslot[2] = uid(\"hegui\");\nslot[3] = uid(\"bantang\");\nslot[4] = uid(\"niguang\");\nslot[5] = uid(\"yequfm\");\nslot[6] = uid(\"h404\");\nslot[7] = uid(\"zhiyuan\");\nslot[8] = current_visitor;"}</code>
            </pre>
          </article>
          <PuzzleFrame
            id="ch3-slot"
            title="哪一行允许无账号者加入测试？"
            eyebrow="谜题 09 / 源码"
            state={state}
            solved={solvedSlot}
            hints={[
              "前七行都绑定固定 uid，第八行没有。",
              "current_visitor 指向正在浏览页面的人。",
              "选择 slot[8] = current_visitor。"
            ]}
            onHint={requestHint}
            onSkip={() => solve("ch3-slot", ["slot-source"])}
            solvedText="第八槽位没有主人；每个观看页面的人都可能被填进去。"
          >
            <SingleChoicePuzzle
              instruction="选择真正改变身份归属的源码。"
              options={[
                { id: "cache", label: "cache.mode = readonly;" },
                { id: "avatar", label: "avatar.fallback = default.gif;" },
                { id: "slot", label: "slot[8] = current_visitor;" },
                { id: "music", label: "music.autoplay = true;" }
              ]}
              correctId="slot"
              onCorrect={() => solve("ch3-slot", ["slot-source"])}
            />
          </PuzzleFrame>
        </>
      )}

      {solvedSlot && (
        <>
          <OptionalEvidence
            title="许妍的双声道录音"
            description="左右声道相位错开。拖动校准条，当两条波形重合时可以恢复被抵消的人声；这是《开籍》所需的可选记录之一。"
            collected={audioCollected}
            disabled={phase < 47 || phase > 53}
            disabledLabel="先校准声道"
            onCollect={() => {
              if (phase >= 47 && phase <= 53) solve("optional-xu-audio", ["xu-audio"]);
            }}
          />
          {!audioCollected && (
            <div className="wave-tool">
              <label>
                声道相位校准：{phase}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={phase}
                  onChange={(event) => setPhase(Number(event.target.value))}
                />
              </label>
              <p>{phase >= 47 && phase <= 53 ? "波形重合：“借……我……一个……名字。”现在可以保存。" : "只有噪声。两条波形还没有重合。"}</p>
            </div>
          )}
          {audioCollected && <p className="transcript">[文字稿] 七个呼吸之间出现第八个呼吸。拼接人声：“借我一个名字。”</p>}

          <ChatLog
            messages={[
              { sender: "纸鸢", time: "01:12", text: "它不是在假装成我们。它在学习怎样成为一个能被记住的人。" },
              { sender: "纸鸢", time: "01:13", text: "不要再打开源码。", tone: "warning" },
              { sender: "纸鸢", time: "01:13", text: "继续。第八行下面还有东西。", tone: "warning" }
            ]}
          />
          <div className="identity-sync">
            <span>测试者 8 / 8</span>
            <strong>当前访客：程砚</strong>
            <small>名、形、缘正在同步……</small>
          </div>
        </>
      )}

      {canAdvance && <ChapterComplete nextTitle="第四章《除名之夜》" onAdvance={onAdvance} />}
    </div>
  );
}
