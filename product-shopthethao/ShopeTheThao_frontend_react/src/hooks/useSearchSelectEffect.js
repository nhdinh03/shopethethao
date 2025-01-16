import { useEffect } from 'react';
import funcUtils from '~/utils/funcUtils';
import useDebounce from './useDebounce';

const useSearchSelectEffect = (searchValue, api, options, initialOptions, loadingState, isSearch) => {
    const searchValueDebounce = useDebounce(searchValue, 500);
    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                loadingState.setLoadingStates({ ...loadingState, [options.field]: true });
                const response = await api.getByPage(1, 10, searchValueDebounce);
                options.setOptions(response.data);
            } catch (error) {
                let message = 'Xảy ra lỗi khi tìm kiếm trong select:';
                console.log(`${message} ${options.field}`, error);
                funcUtils.notify(`${message} ${options.field}`, 'error');
            } finally {
                loadingState.setLoadingStates({ ...loadingState, [options.field]: false });
            }
        };

        if (isSearch && searchValueDebounce.trim() !== '') {
            fetchSearchResults();
        } else if (isSearch && searchValueDebounce.trim() === '') {
            loadingState.setLoadingStates({ ...loadingState, [options.field]: false });
            options.setOptions(initialOptions);
        }
    }, [searchValueDebounce]);
};

export default useSearchSelectEffect;
