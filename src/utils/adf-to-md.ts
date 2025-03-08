// Определения типов для Atlassian Document Format (ADF)
// Типы на основе JSON схемы ADF: https://unpkg.com/@atlaskit/adf-schema/dist/json-schema/v1/full.json

// Типы для различных атрибутов узлов
interface HeadingAttrs {
	level: number
}

interface CardAttrs {
	url: string
}

interface CodeBlockAttrs {
	language?: string
}

interface EmojiAttrs {
	shortName: string
}

interface OrderedListAttrs {
	order: number
}

interface LinkAttrs {
	href: string
}

interface TaskItemAttrs {
	localId: string
	state: 'TODO' | 'DONE'
}

interface TaskListAttrs {
	localId: string
}

// Типы атрибутов для всех поддерживаемых узлов
type NodeAttrs =
	| HeadingAttrs
	| CardAttrs
	| CodeBlockAttrs
	| EmojiAttrs
	| OrderedListAttrs
	| TaskItemAttrs
	| TaskListAttrs

// Типы атрибутов для всех поддерживаемых меток
type MarkAttrs = LinkAttrs

// Базовый интерфейс для узлов ADF
interface ADFNode {
	type: string
	content?: ADFNode[]
	text?: string
	marks?: ADFMark[]
	attrs?: NodeAttrs
}

// Интерфейс для меток (форматирование текста)
interface ADFMark {
	type: string
	attrs?: MarkAttrs
}

// Интерфейс для корневого документа ADF
interface ADFDocument extends ADFNode {
	type: 'doc'
	version: number
}

interface ConversionResult {
	result: string
	warnings: Set<string>
}

/**
 * Converts Atlassian Document Format to Markdown
 * @param adf Atlassian Document Format object
 * @returns Object containing the result markdown string and any warnings
 */
export function convertADFToMarkdown(adf: ADFDocument): ConversionResult {
	const warnings = new Set<string>()

	validateADF(adf)

	return {
		result: _convert(adf, warnings),
		warnings,
	}
}

/**
 * Validates the ADF document structure
 * @param adf Atlassian Document Format object to validate
 * @throws Error if validation fails
 */
function validateADF(adf: unknown): asserts adf is ADFDocument {
	// Basic validation
	let ok = true

	if (!adf || typeof adf !== 'object') {
		ok = false
	}

	// Type guard to check if adf is an object and has 'type' and 'version' properties
	if (ok && adf !== null && typeof adf === 'object' && 'type' in adf && 'version' in adf) {
		const doc = adf as { type: unknown; version: unknown }

		if (doc.type !== 'doc') {
			ok = false
		}

		if (doc.version !== 1) {
			ok = false
		}
	} else {
		ok = false
	}

	if (!ok) {
		throw new Error('adf-validation-failed')
	}
}

/**
 * Recursively converts ADF nodes to markdown
 * @param node Current ADF node to convert
 * @param warnings Set to collect warnings
 * @returns Markdown string
 */
function _convert(node: ADFNode, warnings: Set<string>): string {
	const content = node.content || []

	switch (node.type) {
		case 'doc':
			return content.map((node) => _convert(node, warnings)).join('\n\n')

		case 'text':
			return `${_convertMarks(node, warnings)}`

		case 'paragraph':
			return content.map((node) => _convert(node, warnings)).join('')

		case 'heading': {
			const headingAttrs = node.attrs as HeadingAttrs
			return `${'#'.repeat(headingAttrs?.level || 1)} ${content.map((node) => _convert(node, warnings)).join('')}`
		}

		case 'hardBreak':
			return '\n'

		case 'inlineCard':
		case 'blockCard':
		case 'embedCard': {
			const cardAttrs = node.attrs as CardAttrs
			return `[${cardAttrs?.url}](${cardAttrs?.url})`
		}

		case 'blockquote':
			return `> ${content.map((node) => _convert(node, warnings)).join('\n> ')}`

		case 'bulletList':
		case 'orderedList': {
			return `${content
				.map((subNode, index) => {
					const listType = node.type
					let order = 1

					if (listType === 'orderedList') {
						const listAttrs = node.attrs as OrderedListAttrs
						order = (listAttrs?.order || 1) + index
					}

					return _convertListItem(subNode, warnings, listType, order)
				})
				.join('\n')}`
		}

		case 'listItem': {
			// Default handling, but typically accessed through _convertListItem
			const symbol = '*'
			return `  ${symbol} ${content.map((node) => _convert(node, warnings).trimEnd()).join(` `)}`
		}

		case 'codeBlock': {
			const codeAttrs = node.attrs as CodeBlockAttrs
			const language = codeAttrs?.language ? ` ${codeAttrs.language}` : ''
			return `\`\`\`${language}\n${content.map((node) => _convert(node, warnings)).join('\n')}\n\`\`\``
		}

		case 'rule':
			return '\n\n---\n'

		case 'emoji': {
			const emojiAttrs = node.attrs as EmojiAttrs
			return emojiAttrs?.shortName || ''
		}

		case 'table':
			return content.map((node) => _convert(node, warnings)).join('')

		case 'tableRow': {
			let output = '|'
			let thCount = 0
			output += content
				.map((subNode) => {
					thCount += subNode.type === 'tableHeader' ? 1 : 0
					return _convert(subNode, warnings)
				})
				.join('')
			output += thCount ? `\n${'|:-:'.repeat(thCount)}|\n` : '\n'
			return output
		}

		case 'tableHeader':
			return `${content.map((node) => _convert(node, warnings)).join('')}|`

		case 'tableCell':
			return `${content.map((node) => _convert(node, warnings)).join('')}|`

		case 'taskList': {
			return content.map((node) => _convert(node, warnings)).join('\n')
		}

		case 'taskItem': {
			const taskAttrs = node.attrs as TaskItemAttrs
			const checkbox = taskAttrs?.state === 'DONE' ? '[x]' : '[ ]'
			return `- ${checkbox} ${content.map((node) => _convert(node, warnings)).join('')}`
		}

		default:
			// Handle unknown node types as paragraphs
			if (content.length > 0) {
				// If node has content, treat it as a paragraph
				const paragraphContent = content.map((node) => _convert(node, warnings)).join('')
				warnings.add(`unknown-type-${node.type}`)
				return paragraphContent
			} else {
				// Otherwise just log a warning
				warnings.add(`unsupported-type-${node.type}`)
				return ''
			}
	}
}

/**
 * Helper function to convert list items with proper formatting
 */
function _convertListItem(node: ADFNode, warnings: Set<string>, listType: string, order: number): string {
	if (node.type !== 'listItem') {
		warnings.add(`expected-listItem-got-${node.type}`)
		return ''
	}

	const content = node.content || []
	const symbol = listType === 'bulletList' ? '*' : `${order}.`
	return `  ${symbol} ${content.map((node) => _convert(node, warnings).trimEnd()).join(` `)}`
}

/**
 * Converts text node with marks to markdown
 * @param node Text node with marks
 * @param warnings Set to collect warnings
 * @returns Markdown formatted text
 */
function _convertMarks(node: ADFNode, warnings: Set<string>): string {
	if (!node.text) {
		return ''
	}

	if (!node.marks || !Array.isArray(node.marks)) {
		return node.text
	}

	return node.marks.reduce((converted, mark) => {
		switch (mark.type) {
			case 'code':
				converted = `\`${converted}\``
				break

			case 'em':
				converted = `_${converted}_`
				break

			case 'link': {
				const linkAttrs = mark.attrs as LinkAttrs
				converted = `[${converted}](${linkAttrs?.href || ''})`
				break
			}

			case 'strike':
				converted = `~~${converted}~~`
				break

			case 'strong':
				converted = `**${converted}**`
				break

			default: // not supported
				warnings.add(`unsupported-mark-${mark.type}`)
				break
		}

		return converted
	}, node.text)
}
