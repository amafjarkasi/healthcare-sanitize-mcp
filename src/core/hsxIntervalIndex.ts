interface Span {
  start: number;
  end: number;
  ref: number;
}

export class HsxIntervalIndex {
  private spans: Span[] = [];
  insert(start: number, end: number, ref: number) {
    this.spans.push({ start, end, ref });
  }
  finalize() {
    this.spans.sort((a, b) => a.start - b.start || a.end - b.end);
  }
  overlaps(start: number, end: number): number[] {
    const out: number[] = [];
    for (const s of this.spans) {
      if (s.end <= start) continue;
      if (s.start >= end) break;
      out.push(s.ref);
    }
    return out;
  }
}