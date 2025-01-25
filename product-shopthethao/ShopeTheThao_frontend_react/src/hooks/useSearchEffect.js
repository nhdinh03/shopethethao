import { useEffect } from 'react';
import funcUtils from '~/utils/funcUtils';
import useDebounce from './useDebounce';

const useSearch = (searchValue, api, setStateList, isSearching) => {
    const searchValueDebounce = useDebounce(searchValue, 500);
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const resp = await api.getByPage(1, 10, searchValueDebounce);
                let list = [];
                if (resp.data?.data) {
                    list = resp.data.data;
                } else {
                    list = resp.data;
                }
                console.log(' tìm kiếm: ', list);
                setStateList(list);
            } catch (error) {
                let message = 'Xảy ra lỗi khi tìm kiếm:';
                funcUtils.notify(`${message}`, 'error');
                console.log(error);
            }
        };
        if (isSearching && searchValueDebounce.trim() !== '') {
            fetchSearchResults();
        } else if (isSearching && searchValueDebounce.trim() === '') {
            console.log('không tìm kiếm');
            fetchSearchResults();
        }
    }, [searchValueDebounce]);
};

export default useSearch;
