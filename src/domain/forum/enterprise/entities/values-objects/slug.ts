export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    return new Slug(value)
  }

  /**
   * Receives a string e normalize it as slug
   *
   * Example: "An example title" => "an-example-title"
   *
   *  @param text {string}
   */

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD') // Remove td acentuação
      .toLowerCase()
      .trim() // Remove td espaçamento antes e depois
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
