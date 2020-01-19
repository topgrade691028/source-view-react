/* istanbul ignore file */
import {ReactNode, DOMAttributes} from 'react';
import {SyntaxElement, TreeNode} from 'source-tokenizer';

export type RenderSyntaxTree = (root: TreeNode, defaultRender: RenderSyntaxElement, i: number) => ReactNode;

export type RenderSyntaxElement = (element: SyntaxElement, i: number) => ReactNode;

export type EventAttributes = Omit<DOMAttributes<HTMLTableCellElement>, 'children' | 'dangerouslySetInnerHTML'>;
