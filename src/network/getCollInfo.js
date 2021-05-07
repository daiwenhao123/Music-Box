import {request} from './request.js'

export function getCollInfo (uid) {
	return request({
		url:'/user/playlist',
		params:{
			uid
		}
	})
}