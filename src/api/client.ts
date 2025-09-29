import { SeqUiServerService } from "~/api/services/seq-ui-server"
import Axios from 'axios'

export const getApi = () => {
	const axios = Axios.create({
		timeout: 59000,
		baseURL: window.__CONFIG__.SEQ_UI_URL
	})

	return {
		seqUiServer: new SeqUiServerService(axios),
	}
}
