import * as React from 'react';
import { useContext, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { BookProps } from './types';
import { NewContext } from './app';

const BookContainer = styled.div`
    border-bottom: 1px solid #999;
    padding: 10px;
    box-sizing: border-box;
`
const Author = styled.p``
const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const Title = styled.h2`
    max-width: 50%;
`
const Action = styled.div`
    cursor: pointer;
    font-weight: 900;
`
const ActionText = styled.span`
    text-decoration: underline;
`
const ActionSymbol = styled.span`
    text-decoration: none;
`
const Description = styled.p``
const Tags = styled.div``
const Tag = styled.span`
    margin-right: 5px;
    background-color: lightgray;
    padding: 3px;
    cursor: pointer;
 
    &::last-of-type {
        margin-right: 0;
    }
`




interface BookListItemProps {
    book: BookProps,
    listType: "read" | "progress" | "done",
    onChangeHeight?:() => void,
    style?: React.CSSProperties;
}
export const BookListItem: React.FC<BookListItemProps> = ({ book, onChangeHeight, style, listType }) => {
    const { author, title, description, tags, id } = book;
    const { relocateBookHandler, filterByTag } = useContext(NewContext);

    useLayoutEffect(() => {
        onChangeHeight && onChangeHeight()

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <BookContainer style={style}>
            <Author>{author}</Author>
            <TitleContainer>
                <Title>{title}</Title>
                <Action onClick={relocateBookHandler.bind(null, id)}>
                    {listType === 'read' && 
                        <><ActionText>start reading</ActionText>
                          <ActionSymbol> &rarr;</ActionSymbol></>}
                    {listType === 'progress' && 
                        <><ActionText>finish reading</ActionText>
                          <ActionSymbol> &rarr;</ActionSymbol></>}
                    {listType === 'done' && 
                        <><ActionText>return in «to read»</ActionText>
                          <ActionSymbol> ↲</ActionSymbol></>}
                </Action>
            </TitleContainer>
            <Description>{description}</Description>
            <Tags>
                {tags.map((tag, index) => <Tag onClick={filterByTag.bind(null, tag)} key={index}>{`#${tag}`}</Tag>)}
            </Tags>
        </BookContainer>
    )
}