import * as React from 'react';
import styled from 'styled-components';
import { List, CellMeasurer, CellMeasurerCache, Index } from 'react-virtualized';
import AutoSizer from "react-virtualized-auto-sizer";

import { BookProps } from './types';
import { BookListItem } from './book-list-item';

const Content = styled.div`
    width: 100%;
    height: 550px;
    position: relative;
`
const EmptyMessage = styled.div`
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
`



interface BookListProps {
    list: BookProps[],
    listType: "read" | "progress" | "done"
}
const cache = new CellMeasurerCache({
    defaultHeight: 500,
    fixedWidth: true
});

export const BookList:React.FC<BookListProps> = ({ list, listType }) => {
    return (
        <Content>

            {list.length ? 
                <AutoSizer>
                    {({ height, width }) => (
                    <List
                        rowCount={list.length}
                        width={width}
                        height={height}
                        rowHeight={({ index }: Index) => cache.rowHeight({ index })}
                        deferredMeasurementCache={cache}
                        rowRenderer={({ index, key, parent, style })=>{
                        return  <CellMeasurer
                                    cache={cache}
                                    columnIndex={0}
                                    key={key}
                                    overscanRowCount={20}
                                    parent={parent}
                                    rowIndex={index}
                                >
                                    {({ measure }) => {
                                        return   <BookListItem
                                                    key={list[index].id}
                                                    book={list[index]}
                                                    listType={listType}
                                                    style={style}
                                                    onChangeHeight={measure}
                                                />
                                    }}
                                </CellMeasurer>
                        }}
                        overscanRowCount={20}
                    />
                    )}
                </AutoSizer>
            :
            <EmptyMessage>List is empty</EmptyMessage>}
        </Content>
    )
}