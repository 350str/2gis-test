import * as React from 'react';
import { useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import styled from 'styled-components';

import { GlobalStyle } from './global-style';
import { Services } from '../services/services';
import { BookProps } from './types';
import { BookList } from './book-list';


const Page = styled.div`
    font-family: "Roboto";
    .active-tab {
      border-bottom: none;
      font-weight: 900;
    }
`
const Title = styled.h1`
    text-align: center;
`
const STabs = styled(Tabs)`
    width: 80%;
    max-width: 1280px;
    min-width: 480px;
    margin: 0 auto;
    border: 1px solid #999;
`
const STab = styled(Tab)`
    flex: 1;
    border-right: 1px solid #999;
    border-bottom: 1px solid #999;
    color: #000;
    text-align: center;
    background: transparent;
    cursor: pointer;
    outline: none;
    height: 100%;
    padding: 1.2rem;
    box-sizing: border-box;
    
    &:active {
      background: #999;
      color: white;
    }

    &:last-child {
      border-right: none;
    }
`
const STabList = styled(TabList)`
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    height: 60px;
    position: relative;
    z-index: 2;
`
const FilterBar = styled.div`
    padding: 10px;
    border-top: 1px solid #999;
`
const FilterText = styled.span`
    margin: 5px;
`
const FilterClear = styled.span`
    margin: 5px;
    text-decoration: underline;
    cursor: pointer;
`
const Tag = styled(FilterText)`
    background-color: lightgray;
`

export const NewContext = React.createContext(
    {
        relocateBookHandler: (id: string) => {}, 
        filterByTag: (tag: string) => {}
    }
);

interface AppStateProps {
    [key: string]: BookProps[]
}

export const App:React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [bookList, setBookList] = useState<AppStateProps>({
        readList: [],
        progressList: [],
        doneList: []
    });
    const [activeTags, setActiveTags] = useState<string[]>([]);

    const { readList, progressList, doneList } = bookList;

    // *** получаем данные книг и устанавливаем в качестве стейта ***
    useEffect(() => {
        new Services().getThousandBooks()
                      .then(res => setBookList({ ...bookList, readList: res.items }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // *** смотрим url на совпадение с регулярным выражением (устанвлаиваем активные теги) ***
    useEffect(() => {
        const tagsRegex = /tags=([\w|,]+)/
        const filter = window.location.search.length && 
                       window.location.search.match(tagsRegex) && 
                       window.location.search.match(tagsRegex)![1];
        const tags = filter && filter.split(',')
        tags ? setActiveTags([ ...tags ]) : setActiveTags([]);
    }, [])

    // *** смотрим url на совпадение с регулярным выражением (устанвлаиваем активный таб) ***
    useEffect(() => {
        const tabRegex = /tab=([\w]+)/;
        const tabFilter = window.location.search.length && 
                          window.location.search.match(tabRegex) && 
                          window.location.search.match(tabRegex)![1];
        const arr = ['toread', 'inprogress', 'done'];
        const tab = tabFilter && arr.indexOf(tabFilter);
        tab ? setActiveTab(tab) : setActiveTab(0);
    }, [])

    // *** функция фильтрации массива карточек по тегам ***
    const filteredArr = (bookArr: BookProps[]) => {
        if (!activeTags.length) return bookArr;
        return bookArr.filter(book => activeTags.every(tag => book.tags.includes(tag)))  
    }

    // *** функция перемещения карточек между списками read-inprogress-done-read-... ***
    const relocateBookHandler = (id: string) => {
        for (let key in bookList) {
            let index = bookList[key].findIndex(item => item.id === id);
            if (index !== -1) {
                const arr = ['readList', 'progressList', 'doneList'];
                const currentIndex = arr.indexOf(key);
                const nextList = arr[currentIndex + 1] || arr[0];
                setBookList({
                    ...bookList,
                    [key]: [
                        ...bookList[key].slice(0, index),
                        ...bookList[key].slice(index + 1)
                    ],
                    [nextList]: [
                        ...bookList[nextList],
                        ...bookList[key].slice(index, index + 1)
                    ]
                })
                break        
            }
        }
 
    }

    // *** колбэк фильтрации по тегам ***
    const filterByTag = (tag: string) => {
        !activeTags.includes(tag) && setActiveTags([...activeTags, tag]);
    }

    // *** колбэк очистки тэгов ***
    const clearTagHandler = () => {
        setActiveTags([]);
    }

    return (
        <> 
            <GlobalStyle />
            <Page>
                <Title>Book list</Title>
                <STabs selectedTabClassName="active-tab" 
                       selectedIndex={activeTab} 
                       onSelect={tabIndex => setActiveTab(tabIndex)}
                >
                    <STabList>
                        <STab>{`To read(${readList.length})`}</STab>
                        <STab>{`In progress(${progressList.length})`}</STab>
                        <STab>{`Done(${doneList.length})`}</STab>
                    </STabList>
                    {!!activeTags.length && <FilterBar>
                        <FilterText>Filtered by tags: </FilterText>
                        {activeTags.map((tag, tagIndex) => <Tag key={tagIndex}>{`#${tag}`}</Tag>)}
                        <FilterClear onClick={clearTagHandler}>(clear)</FilterClear>
                    </FilterBar>}
                    <NewContext.Provider value={{ relocateBookHandler,  filterByTag}} >
                        <TabPanel>
                            <BookList 
                                list={filteredArr.call(null, readList)} 
                                listType="read"    
                            />    
                        </TabPanel>
                        <TabPanel>
                            <BookList 
                                list={filteredArr.call(null, progressList)} 
                                listType="progress"
                            />
                        </TabPanel>
                        <TabPanel>
                            <BookList 
                                list={filteredArr.call(null, doneList)} 
                                listType="done"
                            />
                        </TabPanel>
                    </NewContext.Provider>
                </STabs>
            </Page>
        </>
    )
}


