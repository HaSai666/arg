import { useMemo, useState, type ReactNode } from "react";
import type { StoryState } from "../game/types";

export interface MarginalClue {
  mark: string;
  source: string;
  text: string;
  placement: "left" | "right" | "bottom";
}

interface PuzzleFrameProps {
  id: string;
  title: string;
  eyebrow: string;
  state: StoryState;
  solved: boolean;
  marginalia: MarginalClue[];
  onHint: (id: string, max: number) => void;
  onSkip: () => void;
  solvedText: string;
  children: ReactNode;
}

export const PuzzleFrame = ({
  id,
  title,
  eyebrow,
  state,
  solved,
  marginalia,
  onHint,
  onSkip,
  solvedText,
  children
}: PuzzleFrameProps) => {
  const hintLevel = state.hintLevels[id] ?? 0;
  const revealedMarginalia = marginalia.slice(0, hintLevel);
  const nextMarginalia = marginalia[hintLevel];

  return (
    <section className={solved ? "puzzle-card is-solved" : "puzzle-card"} aria-labelledby={id + "-title"}>
      <div className="puzzle-head">
        <div>
          <span className="puzzle-eyebrow">{eyebrow}</span>
          <h3 id={id + "-title"}>{title}</h3>
        </div>
        <span className="puzzle-status">{solved ? "记录一致" : "等待校验"}</span>
      </div>
      {solved ? (
        <div className="solved-message" role="status">✓ {solvedText}</div>
      ) : (
        <>
          {children}
          <div className="marginal-system">
            <div className="marginal-summary">
              <span>边角旁证 {hintLevel} / {marginalia.length}</span>
              <small>每翻看一份，访客痕迹会增加 1 次</small>
            </div>
            {revealedMarginalia.length > 0 && (
              <div className="found-marginalia" aria-live="polite">
                {revealedMarginalia.map((clue, index) => (
                  <aside key={clue.source} className={index % 2 === 0 ? "paper-scrap" : "paper-scrap tilted"}>
                    <span>{clue.mark} · {clue.source}</span>
                    <p>{clue.text}</p>
                  </aside>
                ))}
              </div>
            )}
            {nextMarginalia && (
              <button
                className={`marginal-trigger placement-${nextMarginalia.placement}`}
                type="button"
                onClick={() => onHint(id, marginalia.length)}
                aria-label={`查看页面边角的${nextMarginalia.source}`}
              >
                <b aria-hidden="true">{nextMarginalia.mark}</b>
                <span><small>翻看下一份旁证</small><strong>{nextMarginalia.source}</strong></span>
              </button>
            )}
            {hintLevel >= marginalia.length && (
              <div className="mirror-recovery">
                <span>三份旁证已经读完。当前索引仍无法与旧站记录互相印证。</span>
                <button className="text-button" type="button" onClick={onSkip}>
                  以只读镜像覆盖这一处
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

const normalizeText = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s，。！？、,.!?:：；;“”"'（）()·_\-]/g, "");

interface TextPuzzleProps {
  label: string;
  accepted: string[];
  placeholder?: string;
  onCorrect: () => void;
}

export const TextPuzzle = ({
  label,
  accepted,
  placeholder,
  onCorrect
}: TextPuzzleProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const normalizedLength = normalizeText(value).length;
  const expectedLengths = [...new Set(accepted.map((answer) => normalizeText(answer).length))]
    .sort((left, right) => left - right);
  const expectedLengthLabel = expectedLengths.join(" 或 ");

  const submit = () => {
    const normalized = normalizeText(value);
    if (accepted.some((answer) => normalizeText(answer) === normalized)) {
      setError("");
      onCorrect();
    } else if (normalized.length === 0) {
      setError("还没有输入内容。先把证据中能确认的文字写下来。");
    } else if (!expectedLengths.includes(normalized.length)) {
      setError(`格式不一致：当前是 ${normalized.length} 个字，这条记录应为 ${expectedLengthLabel} 个字。`);
    } else {
      setError("字数已经吻合，但内容还不能与现有记录互相印证。请对照题面中的关键词。");
    }
  };

  return (
    <div className="puzzle-input">
      <label>
        <span>{label}</span>
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder={placeholder}
          autoComplete="off"
          aria-describedby={`${label}-format`}
        />
        <small className="input-helper" id={`${label}-format`}>
          已输入 {normalizedLength} 字，可接受 {expectedLengthLabel} 字
        </small>
      </label>
      <button className="retro-button" type="button" onClick={submit}>提交</button>
      {error && <p className="input-error" role="alert">{error}</p>}
    </div>
  );
};

export interface OrderItem {
  id: string;
  label: string;
  clue: string;
}

interface OrderPuzzleProps {
  items: OrderItem[];
  correctOrder: string[];
  onCorrect: () => void;
  instruction: string;
}

export const OrderPuzzle = ({
  items,
  correctOrder,
  onCorrect,
  instruction
}: OrderPuzzleProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const selectedItems = selected
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is OrderItem => Boolean(item));

  const submit = () => {
    if (selected.length !== correctOrder.length) {
      setChecked(false);
      setError(`顺序还不完整，还缺 ${correctOrder.length - selected.length} 项。`);
      return;
    }
    const correct = selected.every((id, index) => id === correctOrder[index]);
    setChecked(true);
    if (correct) {
      setError("");
      onCorrect();
    } else {
      const confirmedCount = selected.filter((id, index) => id === correctOrder[index]).length;
      setError(`${confirmedCount} 个位置已经确认；冲突项已标出，可以直接上移、下移或移除，不必清空重来。`);
    }
  };

  const updateSelection = (next: string[]) => {
    setSelected(next);
    setChecked(false);
    setError("");
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= selected.length) return;
    const next = [...selected];
    [next[index], next[target]] = [next[target], next[index]];
    updateSelection(next);
  };

  return (
    <div>
      <p className="instruction">{instruction}</p>
      <div className="order-pool">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            disabled={selected.includes(item.id)}
            onClick={() => updateSelection([...selected, item.id])}
          >
            <strong>{item.label}</strong>
            <small>{item.clue}</small>
          </button>
        ))}
      </div>
      <ol className={checked ? "selected-order has-feedback" : "selected-order"} aria-label="当前排列">
        {selectedItems.length === 0 && <li className="empty">尚未排列</li>}
        {selectedItems.map((item, index) => {
          const positionCorrect = checked && selected[index] === correctOrder[index];
          return (
            <li
              className={checked ? (positionCorrect ? "position-correct" : "position-conflict") : ""}
              key={item.id}
            >
              <span className="order-position">{index + 1}</span>
              <span className="order-label"><strong>{item.label}</strong><small>{item.clue}</small></span>
              {checked && <span className="position-result">{positionCorrect ? "位置吻合" : "位置冲突"}</span>}
              <span className="order-actions">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>上移</button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === selected.length - 1}>下移</button>
                <button type="button" onClick={() => updateSelection(selected.filter((id) => id !== item.id))}>移除</button>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="button-row">
        <button className="retro-button" type="button" onClick={submit}>核对顺序</button>
        <button
          className="retro-button subtle"
          type="button"
          onClick={() => updateSelection([])}
          disabled={selected.length === 0}
        >
          清空
        </button>
      </div>
      {error && <p className="input-error" role="alert">{error}</p>}
    </div>
  );
};

interface SelectPrompt {
  id: string;
  quote: string;
}

interface SelectMapPuzzleProps {
  prompts: SelectPrompt[];
  options: string[];
  correct: Record<string, string>;
  onCorrect: () => void;
}

export const SelectMapPuzzle = ({
  prompts,
  options,
  correct,
  onCorrect
}: SelectMapPuzzleProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  const submit = () => {
    const valid = prompts.every((prompt) => answers[prompt.id] === correct[prompt.id]);
    setChecked(true);
    if (valid) {
      setError("");
      onCorrect();
    } else {
      const conflictCount = prompts.filter((prompt) => answers[prompt.id] !== correct[prompt.id]).length;
      setError(`有 ${conflictCount} 条留言仍与账号口吻冲突，已在对应记录旁标出。`);
    }
  };

  return (
    <div>
      <div className="quote-mapping">
        {prompts.map((prompt) => (
          <label
            className={checked ? (answers[prompt.id] === correct[prompt.id] ? "mapping-correct" : "mapping-conflict") : ""}
            key={prompt.id}
          >
            <span>“{prompt.quote}”</span>
            <select
              value={answers[prompt.id] ?? ""}
              onChange={(event) => {
                setAnswers((current) => ({ ...current, [prompt.id]: event.target.value }));
                setChecked(false);
                setError("");
              }}
            >
              <option value="">选择原留言者</option>
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
            {checked && <small>{answers[prompt.id] === correct[prompt.id] ? "口吻吻合" : "请重新核对"}</small>}
          </label>
        ))}
      </div>
      <button className="retro-button" type="button" onClick={submit}>恢复留言归属</button>
      {error && <p className="input-error" role="alert">{error}</p>}
    </div>
  );
};

interface CheckItem {
  id: string;
  text: string;
  author: string;
}

interface CheckSetPuzzleProps {
  items: CheckItem[];
  correctIds: string[];
  onCorrect: () => void;
  instruction: string;
}

export const CheckSetPuzzle = ({
  items,
  correctIds,
  onCorrect,
  instruction
}: CheckSetPuzzleProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const expected = useMemo(() => [...correctIds].sort().join("|"), [correctIds]);

  const submit = () => {
    if ([...selected].sort().join("|") === expected) {
      setError("");
      onCorrect();
    } else {
      setError("标记结果仍有矛盾。异常从不使用“我”，也不会创造新句子。");
    }
  };

  return (
    <div>
      <p className="instruction">{instruction}</p>
      <div className="check-list">
        {items.map((item) => (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={(event) =>
                setSelected((current) =>
                  event.target.checked
                    ? [...current, item.id]
                    : current.filter((id) => id !== item.id)
                )
              }
            />
            <span>
              <strong>{item.author}</strong>
              {item.text}
            </span>
          </label>
        ))}
      </div>
      <button className="retro-button" type="button" onClick={submit}>确认伪造留言</button>
      {error && <p className="input-error" role="alert">{error}</p>}
    </div>
  );
};

interface SingleChoicePuzzleProps {
  options: Array<{ id: string; label: string }>;
  correctId: string;
  onCorrect: () => void;
  instruction: string;
}

export const SingleChoicePuzzle = ({
  options,
  correctId,
  onCorrect,
  instruction
}: SingleChoicePuzzleProps) => {
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (selected === correctId) {
      setError("");
      onCorrect();
    } else {
      setError("这行代码无法解释为什么“没有账号的人”也能加入测试。");
    }
  };

  return (
    <div>
      <p className="instruction">{instruction}</p>
      <div className="code-options">
        {options.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="source-line"
              checked={selected === option.id}
              onChange={() => setSelected(option.id)}
            />
            <code>{option.label}</code>
          </label>
        ))}
      </div>
      <button className="retro-button" type="button" onClick={submit}>检查源码</button>
      {error && <p className="input-error" role="alert">{error}</p>}
    </div>
  );
};
