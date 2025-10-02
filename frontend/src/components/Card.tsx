import { Card as CardBootstrap, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useCallback, useContext } from 'react';
import axios from 'axios';

import { SubmitContext } from '@frontend/components/Context';
import { axiosErrorHandler } from '@frontend/utilities/axiosErrorHandler';
import { routes } from '@frontend/routes';
import { toast } from '@frontend/utilities/toast';
import type { IdeaEntity } from '@backend/db/entities/idea.entity';

interface IdeaPropsInterface {
  idea: IdeaEntity;
  setData: React.Dispatch<React.SetStateAction<IdeaEntity[]>>;
  style: React.CSSProperties;
}

interface IdeaResponceInterface {
  idea: IdeaEntity;
  code: number;
}

export const Card = ({ idea, setData, style }: IdeaPropsInterface) => {
  const { t } = useTranslation('translation', { keyPrefix: 'modules.card' });
  const { t: tToast } = useTranslation('translation', { keyPrefix: 'toast' });

  const { id, title, description, isVoted, votesCount } = idea;

  const { isSubmit, setIsSubmit } = useContext(SubmitContext);

  const onVoteHandler = useCallback(async () => {
    try {
      setIsSubmit(true);
      const { data } = await axios.get<IdeaResponceInterface>(routes.idea.vote(id));
      if (data.code === 1) {
        setData((state) => {
          const index = state.findIndex((value) => value.id === data.idea.id);
          if (index !== -1) {
            state[index] = data.idea;
          }
          return state;
        });
        toast(tToast('voteSuccess'), 'success');
      }
      setIsSubmit(false);
    } catch (e) {
      axiosErrorHandler(e, tToast, setIsSubmit);
    }
  }, [isSubmit]);

  return (
    <CardBootstrap className="idea-card" style={style}>
      <CardBootstrap.Body>
        <CardBootstrap.Title className="d-flex justify-content-between fw-bold mb-4">
          <span>{title}</span>
          <span>{t('votesCount', { count: votesCount })}</span>
        </CardBootstrap.Title>
        <CardBootstrap.Text className="mb-5">
          {description}
        </CardBootstrap.Text>
        <div className="d-flex justify-content-center">
          {!isVoted
            ? <Button variant="success" disabled={isSubmit} onClick={onVoteHandler}>{t('vote')}</Button>
            : <span className="text-muted">{t('isVoted')}</span>}
        </div>
      </CardBootstrap.Body>
    </CardBootstrap>
  );
};
