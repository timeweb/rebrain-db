import NewUserForm from '/js/components/users_form.js'
import RebrainMenu from '/js/components/menu.js'
import Api from '/js/libs/api.js'

Vue.use('menu')
Vue.use('table')
Vue.use(Buefy, {
    defaultProgrammaticPromise: true,
})

new Vue({
    el: '#app',
    components: {
        'new-user-form': NewUserForm,
        'rebrain-menu': RebrainMenu,
    },
    data: {
        pageName: 'users',
        users: [],
        roles: {
            teacher: 'Учитель',
            student: 'Ученик',
        },
        isLoading: true,
        newUserFormActive: false,
    },
    created: async function() {
        this.users = await Api.get_users()
        this.isLoading = false
    },
    methods: {
        async create_user(user) {
            await Api.create_user(user)
            this.users.push(user)
            this.$emit('close')
        },
        async delete_user(user_id) {
            const user = this.users.find(user => user.id == user_id)
            const result = confirm(`Точно удалить пользователя ${user.fio}?`)
            if (!result) {
                return;
            }
            await Api.delete_user(user_id)
            this.users = this.users.filter(user => user.id != user_id)
        }
    },
})

