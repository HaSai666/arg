import { useMemo, useState, type ReactNode } from "react";
import type { StoryState } from "../game/types";

interface PuzzleFrameProps {
  id: string;
  title: string;
  eyebrow: string;
  state: StoryState;
  solved: boolean;
  hints: string[];
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
  hints,
  onHint,
  onSkip,
  solvedText,
  children
}: PuzzleFrameProps) => {
  const hintLevel = state.hintLevels[id] ?? 0;
  return (
    <section className={solved ? "puzzle-card is-solved" : "puzzle-card"} aria-labelledby={id + "-title"}>
      <div className="puzzle-head">
        <div>
          <span className="puzzle-eyebrow">{eyebrow}</span>
          <h3 id={id + "-title"}>{title}</h3>
        </div>
        <span className="puzzle-status">{solved ? "已恢复" : "未解决"}</span>
      </div>
      {solved ? (
        <div className="solved-message" role="status">✓ {solvedText}</div>
      ) : (
        <>
          {children}
          <div className="hint-zone">
            {hintLevel > 0 && (
              <p className="hint-copy" role="status">
                <strong>线索 {hintLevel}/{hints.length}：</strong>
                {hints[Math.min(hintLevel - 1, hints.length - 1)]}
              </p>
            )}
            <div className="button-row">
              <button
                className="retro-button subtle"
                type="button"
                onClick={() => onHint(id, hints.length)}
                disabled={hintLevel >= hints.length}
              >
                {hintLevel === 0 ? "请求线索" : "再给一点线索"}
              </button>
              {hintLevel >= hints.length && (
                <button className="text-button" type="button" onClick={onSkip}>
                  使用答案并继续
                </button>
              )}
            </div>
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

  const submit = () => {
    const normalized = normalizeText(value);
    if (accepted.some((answer) => normalizeText(answer) === normalized)) {
      setError("");
      onCorrect();
    } else {
      setError("页面没有响应。这个答案还无法与现有记录互相印证。");
    }
  };

  return (
    <div className="puzzle-input">
      <label>
        <span>{label}</span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder={placeholder}
          autoComplete="off"
        />
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
  const selectedItems = selected
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is OrderItem => Boolean(item));

  const submit = () => {
    if (selected.length !== correctOrder.length) {
      setError("顺序还不完整。");
      return;
    }
    const correct = selected.every((id, index) => id === correctOrder[index]);
    if (correct) {
      setError("");
      onCorrect();
    } else {
      setError("时间线发生冲突，至少有一项位置不对。可以清空后重新排列。");
    }
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
            onClick={() => {
              setSelected((current) => [...current, item.id]);
              setError("");
            }}
          >
            <strong>{item.label}</strong>
            <small>{item.clue}</small>
          </button>
        ))}
      </div>
      <ol className="selected-order">
        {selectedItems.length === 0 && <li className="empty">尚未排列</li>}
        {selectedItems.map((item) => <li key={item.id}>{item.label}</li>)}
      </ol>
      <div className="button-row">
        <button className="retro-button" type="button" onClick={submit}>核对顺序</button>
        <button
          className="retro-button subtle"
          type="button"
          onClick={() => {
            setSelected([]);
            setError("");
          }}
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

  const submit = () => {
    const valid = prompts.every((prompt) => answers[prompt.id] === correct[prompt.id]);
    if (valid) {
      setError("");
      onCorrect();
    } else {
      setError("至少有一条留言的口吻与账号不符。");
    }
  };

  return (
    <div>
      <div className="quote-mapping">
        {prompts.map((prompt) => (
          <label key={prompt.id}>
            <span>“{prompt.quote}”</span>
            <select
              value={answers[prompt.id] ?? ""}
              onChange={(event) =>
                setAnswers((current) => ({ ...current, [prompt.id]: event.target.value }))
              }
            >
              <option value="">选择原留言者</option>
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
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
