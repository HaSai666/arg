import { useState } from "react";
import { ChapterComplete, ChatLog, FauxPhoto, OptionalEvidence, SideThread } from "../components/StoryBits";
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
  const playlistKept = isSolved("side-xu-playlist");
  const draftKept = isSolved("side-he-draft");
  const [phase, setPhase] = useState(0);

  return (
    <div className="chapter-view cache-theme">
      <header className="cache-header">
        <code>mirror.h404.local / snapshot / 2010-08-27</code>
        <span>只读缓存 · 最后校验失败</span>
        <a href={`${import.meta.env.BASE_URL}archive/mirror-log.txt`} target="_blank" rel="noreferrer">打开原始校时日志</a>
      </header>

      <FauxPhoto
        title="IMG_0827.JPG"
        date="2010-08-27 00:01（相机时间）"
        variant="shadows"
        note="画面中有七个人形，却在地面留下八道影子。"
      />

      <SideThread
        kicker="音乐盒 / 未公开列表"
        title="夜曲FM 没来得及播完的点歌单"
        teaser="第八首歌没有标题，也没有上传者"
        entries={[
          { meta: "点给逆光℃", text: "给总忘记摘镜头盖的人：你还欠我一张能看的合照。播完这首就去操场。" },
          { meta: "曲目 08 / 00:37", text: "标题为空，上传者为空。试听波形里只有一次开门声和八个人的呼吸。" },
          { meta: "夜曲FM 草稿", text: "最后一首是谁加的？我没有录过男声。高越，你听完以后别一个人回暗房。" }
        ]}
        collected={playlistKept}
        onCollect={() => solve("side-xu-playlist", ["side-xu-playlist"])}
        collectLabel="留下第八首的播放记录"
      />

      <PuzzleFrame
        id="ch3-timeline"
        title="校正五条不可能的访问记录"
        eyebrow="镜像校时 / 五条记录"
        state={state}
        solved={solvedTimeline}
        marginalia={[
          { mark: "钟", source: "设备维修贴", text: "逆光℃的相机慢四分钟；何简的电脑快了三分钟。许妍的录音设备与服务器一致。", placement: "right" },
          { mark: "服", source: "服务器毫秒日志", text: "校正后五个起点依次落在 00:03、00:05、00:07、00:08、00:09。", placement: "left" },
          { mark: "轨", source: "缓存播放头", text: "先出现录音波形，再有照片、缓存和退出记录；七个头像的访问轨迹压在最上层。", placement: "bottom" }
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
        <>
        <SideThread
          kicker="星邮草稿箱 / 未发送"
          title="H_404 写给纸鸢的解释"
          teaser="何简第一次承认自己也害怕"
          entries={[
            { meta: "收件人：纸鸢", text: "我查过了，不是闹鬼。只是第八格没有边界检查，读到了本来不该读的访客。可这句话我自己都不信。" },
            { meta: "正文未保存", text: "如果我明天不认识唐雨，把昨天的 hash 发回给我。别告诉他们我提前做了备份，会显得我很怂。" },
            { meta: "投递状态", text: "草稿从未发送。附件仍在，收件人地址却于 00:12 被改成了何简自己的邮箱。" }
          ]}
          collected={draftKept}
          onCollect={() => solve("side-he-draft", ["side-he-draft"])}
          collectLabel="恢复未发送的附件"
        />
        <PuzzleFrame
          id="ch3-language"
          title="标记不是原账号写下的留言"
          eyebrow="文本比对 / 口吻污染"
          state={state}
          solved={solvedLanguage}
          marginalia={[
            { mark: "辞", source: "用词统计", text: "异常记录从未独立写出“我”，也没有使用任何没在七人签名里出现过的短句。", placement: "left" },
            { mark: "diff", source: "签名差异表", text: "有两条留言各自把两个人的签名首尾粘在一起，标点处还留着复制痕迹。", placement: "right" },
            { mark: "拼", source: "剪贴板历史", text: "“照片不会说谎”后接了鹤归的句子；“晚安，世界”后接了纸鸢自己的禁忌。", placement: "bottom" }
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
        </>
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
            eyebrow="源码恢复 / 槽位绑定"
            state={state}
            solved={solvedSlot}
            marginalia={[
              { mark: "//", source: "开发者注释", text: "固定成员都由 uid() 绑定；只有一个槽位会随页面当前访客变化。", placement: "right" },
              { mark: "眼", source: "监视表达式", text: "current_visitor 此刻等于 chengyan，刷新后仍指向正在看页面的人，而不是群成员。", placement: "left" },
              { mark: "8", source: "断点记录", text: "程序最后一次停在 slot[8]。该行右侧没有账号 ID，只有 current_visitor。", placement: "bottom" }
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
                <span>声道相位校准：<output>{phase}</output></span>
                <input
                  aria-label="声道相位校准"
                  aria-valuetext={`当前相位 ${phase}`}
                  type="range"
                  min="0"
                  max="100"
                  value={phase}
                  onChange={(event) => setPhase(Number(event.target.value))}
                />
              </label>
              <p className="wave-calibration-note">维修记录：中心相位 50，允许 ±3 误差（有效窗口 47–53）。</p>
              <p>
                {phase >= 47 && phase <= 53
                  ? "波形重合：“借……我……一个……名字。”现在可以保存。"
                  : phase < 47
                    ? "只有噪声。相位偏低，继续向右校准。"
                    : "只有噪声。相位偏高，向左退回一点。"}
              </p>
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
