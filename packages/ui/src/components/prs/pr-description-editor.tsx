'use client'

import {
  Editor,
  EditorBubbleMenu,
  EditorCharacterCount,
  EditorClearFormatting,
  EditorFloatingMenu,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatSubscript,
  EditorFormatSuperscript,
  EditorFormatUnderline,
  EditorLinkSelector,
  EditorNodeBulletList,
  EditorNodeCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeTable,
  EditorNodeTaskList,
  EditorNodeText,
  EditorProvider,
  EditorSelector,
  EditorTableColumnAfter,
  EditorTableColumnBefore,
  EditorTableColumnDelete,
  EditorTableColumnMenu,
  EditorTableDelete,
  EditorTableFix,
  EditorTableGlobalMenu,
  EditorTableHeaderColumnToggle,
  EditorTableHeaderRowToggle,
  EditorTableMenu,
  EditorTableMergeCells,
  EditorTableRowAfter,
  EditorTableRowBefore,
  EditorTableRowDelete,
  EditorTableRowMenu,
  EditorTableSplitCell,
  JSONContent,
} from '@/components/kibo-ui/editor'
import { useState } from 'react'

interface PRDescriptionEditorProps {
  value?: string
  onChange: (markdown: string) => void
  placeholder?: string
}

export function PRDescriptionEditor({ value, onChange, placeholder }: PRDescriptionEditorProps) {
  const [content, setContent] = useState<JSONContent>({
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Heading 1' }],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Heading 2' }],
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Heading 3' }],
      },
      {
        type: 'heading',
        attrs: { level: 4 },
        content: [{ type: 'text', text: 'Heading 4' }],
      },
      {
        type: 'heading',
        attrs: { level: 5 },
        content: [{ type: 'text', text: 'Heading 5' }],
      },
      {
        type: 'heading',
        attrs: { level: 6 },
        content: [{ type: 'text', text: 'Heading 6' }],
      },
      { type: 'paragraph' },
      { type: 'paragraph', content: [{ type: 'text', text: 'Hello, world.' }] },
      { type: 'paragraph' },
      {
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'This is a todo list' }],
              },
            ],
          },
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'With two items' }],
              },
            ],
          },
        ],
      },
      { type: 'paragraph' },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'This is an unordered list' }],
              },
              {
                type: 'bulletList',
                content: [
                  {
                    type: 'listItem',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'With a nested item' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { type: 'paragraph' },
      {
        type: 'orderedList',
        attrs: { start: 1 },
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'This is an ordered list' }],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'With two items' }],
              },
            ],
          },
        ],
      },
      { type: 'paragraph' },
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This is a quote, probably by someone famous.',
              },
            ],
          },
        ],
      },
      { type: 'paragraph' },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'This is some ' },
          { type: 'text', marks: [{ type: 'code' }], text: 'inline code' },
          { type: 'text', text: ', while this is a code block:' },
        ],
      },
      { type: 'paragraph' },
      {
        type: 'codeBlock',
        attrs: { language: null },
        content: [
          {
            type: 'text',
            text: "function x () {\\n  console.log('hello, world.');\\n}",
          },
        ],
      },
      { type: 'paragraph' },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'You can also create complex tables, like so:',
          },
        ],
      },
      {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableHeader',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Here’s a column' }],
                  },
                ],
              },
              {
                type: 'tableHeader',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Another column' }],
                  },
                ],
              },
              {
                type: 'tableHeader',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Yet another' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableCell',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Cell 1A' }],
                  },
                ],
              },
              {
                type: 'tableCell',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Cell 2A' }],
                  },
                ],
              },
              {
                type: 'tableCell',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Cell 3A' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableCell',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Cell 1B' }],
                  },
                ],
              },
              {
                type: 'tableCell',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Cell 2B' }],
                  },
                ],
              },
              {
                type: 'tableCell',
                attrs: { colspan: 1, rowspan: 1, colwidth: null },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Cell 3B' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  })

  return (
    <EditorProvider
      className="h-full w-full overflow-y-auto min-h-[200px] max-h-[400px] dark:bg-input/30 rounded-lg border p-4"
      content={value}
      placeholder={placeholder || 'Describe your changes...'}
      onUpdate={({ editor }: { editor: Editor }) => {
        const content = editor.getHTML()
        onChange(content)
      }}
    >
      {' '}
      <EditorFloatingMenu>
        <EditorNodeHeading1 hideName />
        <EditorNodeBulletList hideName />
        <EditorNodeQuote hideName />
        <EditorNodeCode hideName />
        <EditorNodeTable hideName />
      </EditorFloatingMenu>
      <EditorBubbleMenu>
        <EditorSelector title="Text">
          <EditorNodeText />
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeHeading3 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeTaskList />
          <EditorNodeQuote />
          <EditorNodeCode />
        </EditorSelector>
        <EditorSelector title="Format">
          <EditorFormatBold />
          <EditorFormatItalic />
          <EditorFormatUnderline />
          <EditorFormatStrike />
          <EditorFormatCode />
          <EditorFormatSuperscript />
          <EditorFormatSubscript />
        </EditorSelector>
        <EditorLinkSelector />
        <EditorClearFormatting />
      </EditorBubbleMenu>
      <EditorTableMenu>
        <EditorTableColumnMenu>
          <EditorTableColumnBefore />
          <EditorTableColumnAfter />
          <EditorTableColumnDelete />
        </EditorTableColumnMenu>
        <EditorTableRowMenu>
          <EditorTableRowBefore />
          <EditorTableRowAfter />
          <EditorTableRowDelete />
        </EditorTableRowMenu>
        <EditorTableGlobalMenu>
          <EditorTableHeaderColumnToggle />
          <EditorTableHeaderRowToggle />
          <EditorTableDelete />
          <EditorTableMergeCells />
          <EditorTableSplitCell />
          <EditorTableFix />
        </EditorTableGlobalMenu>
      </EditorTableMenu>
      <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
    </EditorProvider>
  )
}
