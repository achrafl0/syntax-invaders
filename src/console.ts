export class ConsoleInput {
  private currentInput = "";
  private cursorBlinkTimer = 0;
  private showCursor = true;
  private readonly blinkInterval = 0.5; // seconds
  private readonly height = 80;
  private readonly padding = 10;
  private isActive = false;
  private isDisabled = false;

  // Add history functionality
  private readonly maxHistory = 3;
  private history: string[] = [];
  private historyIndex = -1;
  private savedInput = ""; // Store current input when navigating history

  // Add cursor position
  private cursorPosition = 0;

  // Add feedback states
  private feedbackTimer = 0;
  private readonly feedbackDuration = 0.5; // seconds
  private feedbackType: "success" | "error" | null = null;

  constructor(private canvas: HTMLCanvasElement, disabled: boolean = false) {
    this.isDisabled = disabled;
  }

  showSuccessFeedback(): void {
    this.feedbackType = "success";
    this.feedbackTimer = this.feedbackDuration;
  }

  showErrorFeedback(): void {
    this.feedbackType = "error";
    this.feedbackTimer = this.feedbackDuration;
  }

  handleClick(x: number, y: number): void {
    if (this.isDisabled) return;

    const consoleY = this.canvas.height - this.height;
    if (y >= consoleY) {
      this.isActive = true;
    }
  }

  handleKeyDown(event: KeyboardEvent): string | undefined {
    if (this.isDisabled) return undefined;

    if (!this.isActive) {
      if (event.key === "Enter") {
        this.isActive = true;
        event.preventDefault();
      }
      return undefined;
    }

    switch (event.key) {
      case "Enter":
        // Return input and reset
        if (this.currentInput.trim()) {
          const input = this.currentInput;
          // Add to history
          this.history.unshift(input);
          if (this.history.length > this.maxHistory) {
            this.history.pop();
          }
          this.historyIndex = -1;
          this.currentInput = "";
          this.cursorPosition = 0;
          this.isActive = false;
          return input;
        }
        return undefined;
      case "Escape":
        this.currentInput = "";
        this.cursorPosition = 0;
        this.isActive = false;
        return undefined;
      case "Backspace":
        if (this.cursorPosition > 0) {
          this.currentInput =
            this.currentInput.slice(0, this.cursorPosition - 1) +
            this.currentInput.slice(this.cursorPosition);
          this.cursorPosition--;
        }
        event.preventDefault();
        return undefined;
      case "Delete":
        if (this.cursorPosition < this.currentInput.length) {
          this.currentInput =
            this.currentInput.slice(0, this.cursorPosition) +
            this.currentInput.slice(this.cursorPosition + 1);
        }
        event.preventDefault();
        return undefined;
      case "ArrowLeft":
        if (this.cursorPosition > 0) {
          this.cursorPosition--;
        }
        event.preventDefault();
        return undefined;
      case "ArrowRight":
        if (this.cursorPosition < this.currentInput.length) {
          this.cursorPosition++;
        }
        event.preventDefault();
        return undefined;
      case "ArrowUp":
        if (this.historyIndex === -1) {
          // Save current input before navigating history
          this.savedInput = this.currentInput;
        }
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.currentInput = this.history[this.historyIndex];
          this.cursorPosition = this.currentInput.length;
        }
        event.preventDefault();
        return undefined;
      case "ArrowDown":
        if (this.historyIndex > -1) {
          this.historyIndex--;
          this.currentInput =
            this.historyIndex === -1
              ? this.savedInput
              : this.history[this.historyIndex];
          this.cursorPosition = this.currentInput.length;
        }
        event.preventDefault();
        return undefined;
      case "Home":
        this.cursorPosition = 0;
        event.preventDefault();
        return undefined;
      case "End":
        this.cursorPosition = this.currentInput.length;
        event.preventDefault();
        return undefined;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          this.currentInput =
            this.currentInput.slice(0, this.cursorPosition) +
            event.key +
            this.currentInput.slice(this.cursorPosition);
          this.cursorPosition++;
          event.preventDefault();
        }
        return undefined;
    }
  }

  update(deltaTime: number): void {
    if (this.isDisabled) return;

    // Update cursor blink
    this.cursorBlinkTimer += deltaTime;
    if (this.cursorBlinkTimer >= this.blinkInterval) {
      this.showCursor = !this.showCursor;
      this.cursorBlinkTimer = 0;
    }

    // Update feedback
    if (this.feedbackTimer > 0) {
      this.feedbackTimer -= deltaTime;
      if (this.feedbackTimer <= 0) {
        this.feedbackType = null;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const y = this.canvas.height - this.height;

    // Draw console background with feedback
    let bgColor = this.isDisabled ? "#1a1a1a" : "#1e1e1e";
    if (this.feedbackType === "success") {
      bgColor = "#1a3d1a"; // Dark green
    } else if (this.feedbackType === "error") {
      bgColor = "#3d1a1a"; // Dark red
    }
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, y, this.canvas.width, this.height);

    // Draw border with feedback
    let borderColor = this.isActive ? "#58a6ff" : "#30363d";
    if (this.feedbackType === "success") {
      borderColor = "#4caf50"; // Bright green
    } else if (this.feedbackType === "error") {
      borderColor = "#ff5252"; // Bright red
    }
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, y, this.canvas.width, this.height);

    if (!this.isDisabled) {
      // Draw prompt and input
      ctx.fillStyle = "#c9d1d9";
      ctx.font = "16px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const prompt = "> ";
      const promptWidth = ctx.measureText(prompt).width;
      ctx.fillText(prompt, this.padding, y + this.height / 2);

      // Draw input text
      ctx.fillText(
        this.currentInput,
        this.padding + promptWidth,
        y + this.height / 2
      );

      // Draw cursor
      if (this.isActive && this.showCursor) {
        const textBeforeCursor = this.currentInput.slice(
          0,
          this.cursorPosition
        );
        const cursorX =
          this.padding + promptWidth + ctx.measureText(textBeforeCursor).width;
        ctx.fillRect(cursorX, y + this.height / 4, 2, this.height / 2);
      }
    }
  }

  getHeight(): number {
    return this.height;
  }

  isInputActive(): boolean {
    return this.isActive && !this.isDisabled;
  }
}
