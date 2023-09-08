import faker from 'faker';

import { WordResolver } from '../src/word/resolver/word.resolver';
import { UserTestHelper } from './helper/user/user.helper';
import { StatsRelationSupplier } from './helper/stats/stats-relation-supplier';
import { StatsRelationSupplierModel } from './models/stats-relation-supplier.model';
import { StatsTestHelper } from './helper/stats/stats.helper';
import { GqlResponseModel } from './models/gql-response.model';
import { WordResponseModel } from 'src/word/model/word-response.model';

describe(`${WordResolver.name} (e2e)`, () => {
    const userTestHelper: UserTestHelper = new UserTestHelper();
    const testHelper: StatsTestHelper = new StatsTestHelper();
    const statsRelationSupplier: StatsRelationSupplier = new StatsRelationSupplier(3);
    let sts: StatsRelationSupplierModel;

    beforeAll(async () => {
        await statsRelationSupplier.init();

        sts = statsRelationSupplier.toTestContent();
    });

    afterAll(async () => {
        await userTestHelper.removeUser(sts.user.token);
    });

    it('add single word test', () => {
        const wordStats = sts.words.map((word: WordResponseModel) => {
            return {
                wordId: word.id,
                durationInSeconds: faker.random.number({ min: 0, max: 1000 }),
            };
        });

        return testHelper.createWordTestRequest({ wordStats }, sts.user.token).expect((res: GqlResponseModel) => {
            expect(res.body.errors).toBeUndefined();
        });
    });
});
