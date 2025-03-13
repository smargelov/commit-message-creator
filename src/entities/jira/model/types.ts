export interface IJiraTaskData {
	title: string
	body: ADFDocument
}

export interface HeadingAttrs {
	level: number
}

export interface CardAttrs {
	url: string
}

export interface CodeBlockAttrs {
	language?: string
}

export interface EmojiAttrs {
	shortName: string
}

export interface OrderedListAttrs {
	order: number
}

export interface LinkAttrs {
	href: string
}

export interface TaskItemAttrs {
	localId: string
	state: 'TODO' | 'DONE'
}

interface TaskListAttrs {
	localId: string
}

type NodeAttrs =
	| HeadingAttrs
	| CardAttrs
	| CodeBlockAttrs
	| EmojiAttrs
	| OrderedListAttrs
	| TaskItemAttrs
	| TaskListAttrs

type MarkAttrs = LinkAttrs

export interface ADFNode {
	type: string
	content?: ADFNode[]
	text?: string
	marks?: ADFMark[]
	attrs?: NodeAttrs
}

interface ADFMark {
	type: string
	attrs?: MarkAttrs
}

export interface ADFDocument extends ADFNode {
	type: 'doc'
	version: number
}

export interface ConversionResult {
	result: string
	warnings: Set<string>
}
