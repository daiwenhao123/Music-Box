import {request} from './request.js'

export function getlyric(id) {
	return request({
		url:'/lyric',
		params:{
			id
		}
	})
}