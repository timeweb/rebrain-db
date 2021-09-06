export default {
    props: [],
    data: () => ({
        title: '',
    }),
    methods: {
        create_subject() {
            this.$emit('create-subject', {title: this.title})
            this.$emit('close')
        },
    },
    template: `
        <form action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Создание предмета</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                    <b-field label="title">
                        <b-input
                            v-model="title"
                            placeholder="Название"
                            required>
                        </b-input>
                    </b-field>

                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Отмена"
                        @click="$emit('close')" />
                    <b-button
                        label="Создать"
                        @click="create_subject()"
                        type="is-primary" />
                </footer>
            </div>
        </form>
    `
}
