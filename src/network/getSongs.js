import {request} from './request.js'

export function getSongs(type) {
	return request({
		url:'/top/song',
		params:{
			type
		}
	})
}