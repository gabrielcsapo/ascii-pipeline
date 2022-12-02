# 0.2.1 (12/02/2022)

- adds `IN_PROGRESS` state and changes unknown state color

# 0.2.0 (11/29/2018)

- fixes multi-stage pipelines to have separator between nested pipelines
# before
```
┬ foo       ┬ install        ┬ ┬ lint         ┬ ┬ coverage         ┬ ┬ test     ┬ ┬ docs                  ─    
└ echo $FOO ├ npm --version  ┤ └ npm run lint ┘ └ npm run coverage ┘ └ npm test ┘ └ npm run generate-docs ┘    
            ├ node --version ┤                                                                             
            └ npm            ┘
```

# after
```
┬ foo       ┬ ─ ┬ install        ┬ ─  ┬ lint         ┬ ─  ┬ coverage         ┬ ─  ┬ test     ┬ ─  ┬ docs                  ┬ ─
└ echo $FOO ┘   ├ npm --version  ┤    └ npm run lint ┘    └ npm run coverage ┘    └ npm test ┘    └ npm run generate-docs ┘
                ├ node --version ┤                                                                                        
                └ npm            ┘                                                                        
```
- fixed padding issue with nested children
# before
```
─ starting ┬ nested ┬ ─ ending ─ ┬ nested ─  
           ├ child  ┤           ├ child  ┤  
           └ child1 ┘           └ child1 ┘  
```

# after
```
─ starting ┬ nested ┬  ─ ending ─ ┬ nested ┬ ─
           ├ child  ┤             ├ child  ┤
           └ child1 ┘             └ child1 ┘
```

# 0.1.0 (11/27/2018)

- updates `babel-core` -> `@babel/core`
- moves from `eslint` -> `standard`
- only publish what is needed

# 0.0.3 (01/03/2018)

- ensures there is a buffer character between all values
- does not do a look behind instead places the right and left signs by the value being assessed.

# 0.0.2 (01/01/2018)

- fixes spacing with nested values that have longer names than the parent
- ensure the height of the matrix is the largest height possible

# 0.0.1 (01/01/2018)

- basic usage documented and tested
- works with 2 dimensional nested tasks
