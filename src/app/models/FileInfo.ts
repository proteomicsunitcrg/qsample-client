export class FileInfo {
  peptideHits: number;

  peptideModified: number;

  constructor(peptideHits: number, peptideModified: number) {
    this.peptideHits = peptideHits;

    this.peptideModified = peptideModified;
  }
}
