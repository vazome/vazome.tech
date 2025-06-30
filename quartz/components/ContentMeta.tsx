import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const elements: JSX.Element[] = []

      // Show creation date on first line (without "Created:" label)
      if (fileData.dates) {
        elements.push(
          <div>
            <Date date={getDate(cfg, fileData)!} locale={cfg.locale} />
          </div>
        )
      }

      // Show "Last Updated" and reading time on second line
      const bottomSegments: (string | JSX.Element)[] = []
      
      if (fileData.dates?.modified) {
        bottomSegments.push(
          <span>
            <strong>Last Updated:</strong> <Date date={fileData.dates.modified} locale={cfg.locale} />
          </span>
        )
      }

      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        bottomSegments.push(<span>{displayedTime}</span>)
      }

      if (bottomSegments.length > 0) {
        elements.push(
          <div class="content-meta-bottom">
            {bottomSegments.map((segment, index) => (
              <span key={index}>
                {segment}
                {options.showComma && index < bottomSegments.length - 1 && " • "}
              </span>
            ))}
          </div>
        )
      }

      return (
        <div class={classNames(displayClass, "content-meta")}>
          {elements}
        </div>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
