import React, { useEffect, useState } from 'react'
import { Lumapps } from 'lumapps-sdk-js'
import {
	AspectRatio,
	Button,
	Chip,
	ChipGroup,
	Divider,
	ImageBlock,
	ImageBlockCaptionPosition,
	Notification,
	NotificationType,
	Size,
	Theme,
	Toolbar,
	UserBlock
} from '@lumx/react'

import {
	FormattedMessage,
	IntlProvider
} from '@lumapps-extensions-playground/translations'
import {
	PredefinedErrorBoundary,
	useNotifications,
	NotificationsProvider
} from '@lumapps-extensions-playground/common'

import messagesEn from '../translations/en.json'
import messagesFr from '../translations/fr.json'

import defaultGlobalSettings from './defaultGlobalSettings'

const theme = Theme.light

interface WidgetProps {
	value?: any
	globalValue?: any
}

const Widget: React.FC<WidgetProps> = ({ value = {}, globalValue = {} }) => {
	const [url, setUrl] = useState<string | undefined>()
	const [error, setError] = useState<string>()

	const { imageId, useGreyScale, useBlur, blur } = value
	const { baseUrl = defaultGlobalSettings.baseUrl } = globalValue

	useEffect(() => {
		const size = 1200
		let link = baseUrl
		link =
			imageId && imageId !== ''
				? `${link}id/${imageId}/${size}`
				: `${link}${size}`
		link = useGreyScale ? `${link}?grayscale` : link
		// eslint-disable-next-line no-nested-ternary
		link =
			useBlur && useGreyScale ? `${link}&blur` : useBlur ? `${link}?blur` : link
		link =
			useBlur && blur !== '' && blur !== undefined ? `${link}=${blur}` : link

		setUrl(link)
	}, [blur, imageId, useBlur, useGreyScale, url, baseUrl])

	const { notifySuccess } = useNotifications()

	useEffect(() => {
		notifySuccess('Notification from a widget !!', undefined, undefined, 10000)
	}, [])
	return (
		<div className='widget-picsum'>
			{error && (
				<Notification
					type={NotificationType.error}
					content={<FormattedMessage id='errors.retrieve_user' />}
					isOpen
					actionLabel='Dismiss'
					actionCallback={setError as any}
				/>
			)}
			<ImageBlock
				aspectRatio={AspectRatio.horizontal}
				captionPosition={ImageBlockCaptionPosition.over}
				description={(<FormattedMessage id='description' />) as any}
				tags={
					<ChipGroup>
						<Chip size={Size.s} theme={theme}>
							Marketplace
						</Chip>
						<Chip size={Size.s} theme={theme}>
							Widgets
						</Chip>
						<Chip size={Size.s} theme={theme}>
							LumApps
						</Chip>
					</ChipGroup>
				}
				theme={theme}
				title={(<FormattedMessage id='sub_title' />) as any}
				image={url as string}
			/>
		</div>
	)
}

const NotificationAwareWidget = (props: any) => {
	const messages: any = {
		en: messagesEn,
		fr: messagesFr
	}
	const [lang, setLang] = useState<string>('en');
	useEffect(() => {
		const getContext = async () => {
		const lumapps = new Lumapps();
		const {
			userLang: userLangPromise,
		} = lumapps.context;

		const userLang = await userLangPromise;
		if (Object.keys(messages).includes(userLang)) {
			setLang(userLang);
		}
		};
		getContext();
	}, []);

	return (
		<IntlProvider messages={messages[lang]} locale={lang}>
			<NotificationsProvider>
				<PredefinedErrorBoundary>
					<Widget {...props} />
				</PredefinedErrorBoundary>
			</NotificationsProvider>
		</IntlProvider>
	)
}

export default NotificationAwareWidget
