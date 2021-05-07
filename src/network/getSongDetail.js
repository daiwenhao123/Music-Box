import {request} from './request.js'

export function getSongDetail(ids) {
	return request({
		url:'/song/detail',
		params:{
			ids
		}
	})
}