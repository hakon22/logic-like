import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import type { PaginationQueryInterface } from '@backend/types/pagination.query.interface';
import type { PaginationEntityInterface } from '@backend/types/pagination.entity.interface';
import type { PaginationInterface } from '@backend/types/pagination.interface';
import type { IdeaEntity } from '@backend/db/entities/idea.entity';
import { SubmitContext } from '@frontend/components/Context';
import { routes } from '@frontend/routes';
import { axiosErrorHandler } from '@frontend/utilities/axiosErrorHandler';
import { Helmet } from '@frontend/components/Helmet';
import { Card } from '@frontend/components/Card';
import { useCardColors } from '@frontend/hooks/usePasterColors';

export const Index = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'pages.index' });
  const { t: tToast } = useTranslation('translation', { keyPrefix: 'toast' });

  const defaultLimit = 8;

  const [paginationParams, setPaginationParams] = useState<PaginationInterface>({ count: 0, limit: 8, offset: 0 });
  const [data, setData] = useState<IdeaEntity[]>([]);

  const { isSubmit, setIsSubmit } = useContext(SubmitContext);

  const cardColors = useCardColors(data);

  const fetchItems = useCallback(debounce(async (params: PaginationQueryInterface) => {
    try {
      if (isSubmit) {
        return;
      }
      setIsSubmit(true);
      const { data: { items, paginationParams: fetchedPaginationParams, code } } = await axios.get<PaginationEntityInterface<IdeaEntity>>(routes.idea.findMany, {
        params,
      });
      if (code === 1) {
        setPaginationParams(fetchedPaginationParams);
        setData((state) => [...state, ...items]);
      }
      setIsSubmit(false);
    } catch (e) {
      axiosErrorHandler(e, tToast, setIsSubmit);
    }
  }, 500), [isSubmit]);

  useEffect(() => {
    const params: PaginationQueryInterface = {
      limit: defaultLimit,
      offset: 0,
    };
    fetchItems(params);
  }, []);

  return (
    <div className="container">
      <div className="idea-index">
        <Helmet title={t('title')} description={t('description')} />
        <h1 className="text-center mb-5">{t('title')}</h1>
        <h3 className="text-center mb-5">{t('h3')}</h3>
        <div className="mb-5">
          <p>{t('p1')}</p>
          <p>
            <span className="fw-bold">{t('important')}</span>
            {t('p2')}
          </p>
        </div>
        <InfiniteScroll
          dataLength={data.length}
          className="d-flex flex-column gap-4"
          next={() => fetchItems({ limit: paginationParams.limit, offset: (paginationParams.offset || 0) + defaultLimit })}
          hasMore={data.length < paginationParams.count}
          loader
        >
          {[...data]
            .sort((a, b) => b.votesCount - a.votesCount)
            .map((idea, i) => <Card key={idea.id} idea={idea} setData={setData} style={{ backgroundColor: cardColors[i] }} />)}
        </InfiniteScroll>
      </div>
    </div>
  );
};
