import { ChapterComplete, ChatLog, ProfileChip, SideThread } from "../components/StoryBits";
import { OrderPuzzle, PuzzleFrame, SelectMapPuzzle, TextPuzzle, type OrderItem } from "../components/PuzzleKit";
import { profiles } from "../game/content";
import type { ChapterViewProps } from "./types";

const chainItems: OrderItem[] = [
  { id: "beichuang", label: "北窗", clue: "群公告的发布者，最先安装" },
  { id: "hegui", label: "鹤归", clue: "北窗留言：下一站交给你" },
  { id: "bantang", label: "半糖", clue: "鹤归回复：先去我同桌那里" },
  { id: "niguang", label: "逆光℃", clue: "半糖留言：学长记得拍照" },
  { id: "yequ", label: "夜曲FM", clue: "逆光℃：拍完去听新歌" },
  { id: "h404", label: "H_404", clue: "夜曲FM：播放器坏了找何简" },
  { id: "zhiyuan", label: "纸鸢", clue: "H_404：最后一份交给懂纸的人" }
];

export default function Chapter2({
  state,
  isSolved,
  solve,
  requestHint,
  canAdvance,
  onAdvance
}: ChapterViewProps) {
  const solvedVoices = isSolved("ch2-voices");
  const solvedSeventh = isSolved("ch2-seventh");
  const solvedChain = isSolved("ch2-chain");
  const birthdayKept = isSolved("side-bantang-vote");
  const negativeKept = isSolved("side-gao-negative");

  return (
    <div className="chapter-view">
      <header className="group-header">
        <div>
          <span>星语群组 / 非公开</span>
          <h2>羽化测试群</h2>
          <p>成员：7　可见资料卡：6　创建人：北窗</p>
        </div>
        <span className="group-badge">测试版皮肤互助</span>
      </header>

      <div className="profile-chip-grid">
        {profiles.filter((profile) => profile.id !== "tang-yu").map((profile) => (
          <ProfileChip key={profile.id} profile={profile} />
        ))}
        <div className="profile-chip missing">
          <span className="mini-avatar">?</span>
          <span><strong>资料不可用</strong><small>成员索引 07</small></span>
        </div>
      </div>

      <PuzzleFrame
        id="ch2-voices"
        title="把错位留言还给原作者"
        eyebrow="群组校验 / 留言归属"
        state={state}
        solved={solvedVoices}
        marginalia={[
          { mark: "签", source: "个性签名备份", text: "H_404 的旧签名总在谈服务器；纸鸢唯一反复提醒的是不要公开真名。", placement: "right" },
          { mark: "包", source: "表情包目录", text: "夸张颜文字全部来自 /bantang/sweet/，而这个账号的资料卡刚好缺失。", placement: "left" },
          { mark: "审", source: "群主审核记录", text: "甜口吻归半糖，hash 归 H_404，姓名禁忌归纸鸢；审核人写完后又把自己的名字划掉了。", placement: "bottom" }
        ]}
        onHint={requestHint}
        onSkip={() => solve("ch2-voices")}
        solvedText="三条留言已恢复原始发送者，剩下一种口吻没有资料卡。"
      >
        <SelectMapPuzzle
          prompts={[
            { id: "sweet", quote: "踩过啦～记得回访嗷 \(≧▽≦)/" },
            { id: "hash", quote: "缓存里这个不是我提交的 hash。" },
            { id: "name", quote: "别把真名写进皮肤配置里。" }
          ]}
          options={["鹤归", "逆光℃", "纸鸢", "H_404", "夜曲FM", "北窗", "半糖"]}
          correct={{ sweet: "半糖", hash: "H_404", name: "纸鸢" }}
          onCorrect={() => solve("ch2-voices")}
        />
      </PuzzleFrame>

      {solvedVoices && (
        <PuzzleFrame
          id="ch2-seventh"
          title="恢复第七张资料卡"
          eyebrow="成员索引 07 / 资料卡"
          state={state}
          solved={solvedSeventh}
          marginalia={[
            { mark: "ini", source: "desktop.ini", text: "头像缓存路径 /ty/bantang/ 把姓名缩写和昵称留在了同一层目录。", placement: "left" },
            { mark: "册", source: "花名册撕角", text: "初一（3）班只有一个唐姓女生，名字第二字的下半部像四点水。", placement: "right" },
            { mark: "伞", source: "失物招领", text: "粉色雨伞标签写着“唐雨”；背面用圆珠笔补了一句“半糖，不许拿错”。", placement: "bottom" }
          ]}
          onHint={requestHint}
          onSkip={() => solve("ch2-seventh", ["tang-yu"])}
          solvedText="第七位成员唐雨（半糖）已经恢复。"
        >
          <div className="cache-fragments">
            <code>/avatar/ty/bantang_07.gif</code>
            <span>“小雨今天又没来早读。”</span>
            <span>花名册：唐□　初一（3）班</span>
          </div>
          <TextPuzzle
            label="输入真实姓名或账号昵称"
            accepted={["唐雨", "半糖"]}
            placeholder="两到三个字"
            onCorrect={() => solve("ch2-seventh", ["tang-yu"])}
          />
        </PuzzleFrame>
      )}

      {solvedSeventh && (
        <>
          <SideThread
            kicker="投票应用 / 已停止统计"
            title="半糖的十四岁生日"
            teaser="六个可见头像投出了七张票"
            entries={[
              { meta: "2010-06-17 22:06", text: "半糖：如果我明天真能满十四岁，谁请奶茶？不许投“下次一定”！" },
              { meta: "可见回复", text: "逆光℃说负责拍照，夜曲FM说负责点歌，鹤归答应把暑假作业借她抄。" },
              { meta: "缓存统计", text: "投票者头像只有六个，结果却有七票。多出来的一票没有选项，只留下一句“生日快乐”。" }
            ]}
            collected={birthdayKept}
            onCollect={() => solve("side-bantang-vote", ["side-bantang-vote"])}
            collectLabel="保存没有头像的第七票"
          />
          <article className="retro-post compact">
            <header><h3>半糖最后一条可见日志</h3><p>2010-08-26 23:48</p></header>
            <div className="post-body">
              <p>鹤归，如果明天我没来学校，你要记得不是因为我请假。</p>
              <p>刚才谁用我的号说话？我没有发过那句话。</p>
            </div>
          </article>
          <PuzzleFrame
            id="ch2-chain"
            title="还原七人皮肤测试接力"
            eyebrow="装扮安装日志 / 访问链"
            state={state}
            solved={solvedChain}
            marginalia={[
              { mark: "RSS", source: "群组订阅记录", text: "公告由北窗发出；每个人的回复里都藏着下一位安装者。", placement: "right" },
              { mark: "包", source: "安装包 README", text: "摄影发生在点歌之前；播放器出错后才轮到何简。懂纸的人负责收尾。", placement: "left" },
              { mark: "链", source: "断开的访问链", text: "北窗 → 鹤归 → 半糖 → 逆光℃ → 夜曲FM → H_404 → 纸鸢；链尾仍多出一次无头像访问。", placement: "bottom" }
            ]}
            onHint={requestHint}
            onSkip={() => solve("ch2-chain", ["group-chain"])}
            solvedText="七次访问已经恢复；安装统计却记录了第八次。"
          >
            <OrderPuzzle
              items={chainItems}
              correctOrder={["beichuang", "hegui", "bantang", "niguang", "yequ", "h404", "zhiyuan"]}
              instruction="根据每个人留下的“下一站”留言依次点击账号。"
              onCorrect={() => solve("ch2-chain", ["group-chain"])}
            />
          </PuzzleFrame>
        </>
      )}

      {solvedChain && (
        <>
          <SideThread
            kicker="群相册 / 回收站"
            title="逆光℃坚持没拍坏的废片"
            teaser="一张大家都笑他忘摘镜头盖的照片"
            entries={[
              { meta: "DSC_1048.JPG", text: "逆光℃：别删，黑是因为欠曝，不是镜头盖。我记得按快门时你们七个都在。" },
              { meta: "夜曲FM 回复", text: "那玻璃里的我为什么正看着镜头外面？还有，你明明站在相机后面。" },
              { meta: "自动识别", text: "画面主体：7。玻璃倒影：2。拍摄者：无法判断。文件被标记为“无人拍摄”。" }
            ]}
            collected={negativeKept}
            onCollect={() => solve("side-gao-negative", ["side-gao-negative"])}
            collectLabel="从回收站恢复废片说明"
          />
          <div className="install-counter">
            <span>洞天·beta</span>
            <strong>已有 8 位用户启用此装扮</strong>
          </div>
          <ChatLog
            messages={[
              { sender: "纸鸢", time: "现在", text: "你是谁？为什么你还记得半糖？" },
              { sender: "纸鸢", time: "现在", text: "从现在开始，不要相信任何用我头像发来的话。", tone: "warning" },
              { sender: "程砚", time: "现在", text: "群里明明只有七个账号。" },
              { sender: "纸鸢", time: "现在", text: "不对。那天活着的只有七个。", tone: "warning" }
            ]}
          />
        </>
      )}

      {canAdvance && <ChapterComplete nextTitle="第三章《第八位访客》" onAdvance={onAdvance} />}
    </div>
  );
}
