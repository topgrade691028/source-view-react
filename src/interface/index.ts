/* istanbul ignore file */
import {ReactNode, DOMAttributes, SyntheticEvent} from 'react';
import {SyntaxElement, TreeNode} from 'source-tokenizer';

export type RenderSyntaxTree = (root: TreeNode, defaultRender: RenderSyntaxElement, i: number) => ReactNode;

export type RenderSyntaxElement = (element: SyntaxElement, i: number) => ReactNode;

type DOMEvents = Omit<DOMAttributes<HTMLTableCellElement>, 'children' | 'dangerouslySetInnerHTML'>;

export type EventAttributes = {[K in keyof DOMEvents]?: (line: number, e: SyntheticEvent) => void};

export type RenderGutter = (line: number) => ReactNode;
