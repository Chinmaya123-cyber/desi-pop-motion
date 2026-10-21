import React from 'react';
import {Composition} from 'remotion';
import {defaultInvite, inviteSchema} from './config';
import {DURATION, Video} from './Video';
import {FPS, H, W} from './theme';
import {defaultThanks, THANKS_DURATION, ThankYou, thanksSchema} from './thanks';

export const Root: React.FC = () => (
  <>
    <Composition id="BdayInvite" component={Video} durationInFrames={DURATION} fps={FPS} width={W} height={H} schema={inviteSchema} defaultProps={defaultInvite} />
    <Composition id="ThankYou" component={ThankYou} durationInFrames={THANKS_DURATION} fps={FPS} width={W} height={H} schema={thanksSchema} defaultProps={defaultThanks} />
  </>
);
